import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TenantModel } from '../models/Tenant';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';
import { SessionModel } from '../models/Session';
import { TenantMembershipModel } from '../models/TenantMembership';
import { SubscriptionModel } from '../models/Subscription';
import { PlanModel } from '../models/Plan';
import { RegisterTenantInput, LoginInput, ChangePasswordInput, UpdateTenantSettingsInput } from '@sellzy/validation';
import { env } from '@sellzy/config';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';
import { MfaService } from './mfa.service';

export class AuthService {
  static async registerTenant(input: RegisterTenantInput) {
    const existingTenant = await TenantModel.findOne({ slug: input.slug });
    if (existingTenant) {
      throw new AppError('Tenant slug already taken', 400, 'SLUG_EXISTS');
    }

    const tenantId = `tn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Create Owner Role
    const ownerRole = await RoleModel.create({
      tenantId,
      name: 'Owner',
      description: 'Tenant business owner full authority',
      permissions: ['*'],
      systemRole: true
    });

    const passwordHash = await bcrypt.hash(input.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create Super Admin Owner User
    const user = await UserModel.create({
      tenantId,
      name: input.adminName,
      email: input.adminEmail,
      passwordHash,
      roles: [ownerRole.name],
      isOwner: true,
      status: 'ACTIVE',
      emailVerified: true,
      emailVerificationToken: verificationToken
    });

    // Create Tenant Record
    const tenant = await TenantModel.create({
      tenantId,
      businessName: input.businessName,
      slug: input.slug,
      ownerUserId: user._id.toString(),
      status: 'ACTIVE',
      planId: 'STARTER',
      subscriptionStatus: 'ACTIVE',
      timezone: input.timezone || 'UTC',
      currency: input.currency || 'PKR',
      country: 'PK',
      locale: 'en-PK'
    });

    // Create Tenant Membership
    await TenantMembershipModel.create({
      tenantId,
      userId: user._id.toString(),
      roles: [ownerRole.name],
      isOwner: true,
      status: 'ACTIVE'
    });

    // Create Default Subscription
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await SubscriptionModel.create({
      tenantId,
      planId: 'STARTER',
      status: 'ACTIVE',
      billingInterval: 'MONTHLY',
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      provider: 'DEV_PROVIDER'
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: user._id.toString(),
      action: 'TENANT_CREATED'
    });

    return {
      tenant: {
        tenantId: tenant.tenantId,
        businessName: tenant.businessName,
        slug: tenant.slug
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isOwner: user.isOwner
      }
    };
  }

  static async switchTenant(userId: string, targetTenantId: string, currentSessionId: string) {
    // Server-verify membership
    const membership = await TenantMembershipModel.findOne({
      userId,
      tenantId: targetTenantId,
      status: 'ACTIVE'
    });

    if (!membership) {
      throw new AppError('You do not have an active membership in this tenant', 403, 'MEMBERSHIP_REQUIRED');
    }

    const tenant = await TenantModel.findOne({ tenantId: targetTenantId, status: { $in: ['ACTIVE', 'TRIAL'] } });
    if (!tenant) {
      throw new AppError('Target tenant is suspended or inactive', 403, 'TENANT_INACTIVE');
    }

    const token = jwt.sign(
      { userId, tenantId: targetTenantId, roles: membership.roles, sessionId: currentSessionId },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    // Update Session record
    await SessionModel.updateOne(
      { sessionId: currentSessionId },
      { tenantId: targetTenantId, token, lastActivityAt: new Date() }
    );

    await SecurityService.logSecurityEvent({
      tenantId: targetTenantId,
      actorUserId: userId,
      action: 'TENANT_SWITCHED',
      metadata: { switchedTo: targetTenantId }
    });

    return {
      token,
      tenant: {
        tenantId: tenant.tenantId,
        businessName: tenant.businessName,
        slug: tenant.slug
      }
    };
  }

  static async updateTenantSettings(tenantId: string, input: UpdateTenantSettingsInput) {
    const tenant = await TenantModel.findOne({ tenantId });
    if (!tenant) throw new AppError('Tenant not found', 404, 'TENANT_NOT_FOUND');

    if (input.businessName) tenant.businessName = input.businessName;
    if (input.legalName) tenant.legalName = input.legalName;
    if (input.timezone) tenant.timezone = input.timezone;
    if (input.currency) tenant.currency = input.currency;
    if (input.country) tenant.country = input.country;
    if (input.locale) tenant.locale = input.locale;
    if (input.logo) tenant.logo = input.logo;

    await tenant.save();

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: tenant.ownerUserId,
      action: 'TENANT_UPDATED'
    });

    return tenant;
  }

  static async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const tenant = await TenantModel.findOne({ slug: input.tenantSlug, status: { $in: ['ACTIVE', 'TRIAL'] } });
    if (!tenant) {
      throw new AppError('Tenant not found or inactive', 404, 'TENANT_NOT_FOUND');
    }

    const user = await UserModel.findOne({ tenantId: tenant.tenantId, email: input.email }).select('+passwordHash +mfaSecret +mfaRecoveryCodes');
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check account status lockout/suspension
    if (user.status === 'SUSPENDED' || user.status === 'DISABLED') {
      throw new AppError('Account is suspended or disabled. Contact support.', 403, 'ACCOUNT_DISABLED');
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new AppError('Account is temporarily locked due to multiple failed login attempts. Try again later.', 429, 'ACCOUNT_LOCKED');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lockout
        await SecurityService.logSecurityEvent({
          tenantId: tenant.tenantId,
          actorUserId: user._id.toString(),
          action: 'SUSPICIOUS_LOGIN_DETECTED',
          result: 'FAILURE',
          metadata: { reason: 'Excessive failed login attempts' }
        });
      }
      await user.save();

      await SecurityService.logSecurityEvent({
        tenantId: tenant.tenantId,
        actorUserId: user._id.toString(),
        action: 'FAILED_LOGIN_ATTEMPT',
        result: 'FAILURE'
      });

      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Handle MFA Challenge if enabled
    if (user.mfaEnabled) {
      if (!input.mfaCode) {
        return {
          mfaRequired: true,
          message: 'MFA code or recovery code required'
        };
      }

      const isMfaValid = await MfaService.verifyTotpOrRecoveryCode(user, input.mfaCode);
      if (!isMfaValid) {
        await SecurityService.logSecurityEvent({
          tenantId: tenant.tenantId,
          actorUserId: user._id.toString(),
          action: 'MFA_FAILED',
          result: 'FAILURE'
        });
        throw new AppError('Invalid MFA code or recovery code', 401, 'INVALID_MFA_CODE');
      }
    }

    // Reset failed login counter upon success
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;
    await user.save();

    // Create Session
    const sessionId = `sess_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const token = jwt.sign(
      { userId: user._id.toString(), tenantId: tenant.tenantId, roles: user.roles, sessionId },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await SessionModel.create({
      sessionId,
      tenantId: tenant.tenantId,
      userId: user._id.toString(),
      token,
      userAgent,
      ipAddress,
      lastActivityAt: new Date(),
      expiresAt
    });

    await SecurityService.logSecurityEvent({
      tenantId: tenant.tenantId,
      actorUserId: user._id.toString(),
      action: 'USER_LOGGED_IN'
    });

    return {
      token,
      tenant: {
        tenantId: tenant.tenantId,
        businessName: tenant.businessName,
        slug: tenant.slug
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isOwner: user.isOwner,
        mfaEnabled: user.mfaEnabled
      }
    };
  }

  static async logout(sessionId: string, userId: string, tenantId: string) {
    await SessionModel.updateOne(
      { sessionId, userId, tenantId },
      { revokedAt: new Date(), revokeReason: 'USER_LOGOUT' }
    );

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'USER_LOGGED_OUT'
    });
  }

  static async logoutAll(userId: string, tenantId: string, currentSessionId?: string) {
    const filter: Record<string, unknown> = {
      userId,
      tenantId,
      revokedAt: { $exists: false }
    };
    if (currentSessionId) {
      filter.sessionId = { $ne: currentSessionId };
    }

    await SessionModel.updateMany(filter, {
      revokedAt: new Date(),
      revokeReason: 'LOGOUT_ALL_DEVICES'
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'USER_LOGGED_OUT_ALL'
    });
  }

  static async getUserSessions(userId: string, tenantId: string, currentSessionId?: string) {
    const sessions = await SessionModel.find({ userId, tenantId, revokedAt: { $exists: false } }).sort({ lastActivityAt: -1 });
    return sessions.map(s => ({
      id: s._id,
      sessionId: s.sessionId,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      lastActivityAt: s.lastActivityAt,
      isCurrent: s.sessionId === currentSessionId,
      createdAt: s.createdAt
    }));
  }

  static async revokeSession(sessionId: string, userId: string, tenantId: string) {
    await SessionModel.updateOne(
      { sessionId, userId, tenantId },
      { revokedAt: new Date(), revokeReason: 'REVOKED_BY_USER' }
    );

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'SESSION_REVOKED',
      metadata: { revokedSessionId: sessionId }
    });
  }

  static async changePassword(userId: string, tenantId: string, input: ChangePasswordInput) {
    const user = await UserModel.findOne({ _id: userId, tenantId }).select('+passwordHash');
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password incorrect', 400, 'INVALID_PASSWORD');
    }

    user.passwordHash = await bcrypt.hash(input.newPassword, 10);
    await user.save();

    // Revoke other sessions
    await SessionModel.updateMany(
      { userId, tenantId, revokedAt: { $exists: false } },
      { revokedAt: new Date(), revokeReason: 'PASSWORD_CHANGED' }
    );

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: userId,
      action: 'PASSWORD_CHANGED'
    });
  }
}
