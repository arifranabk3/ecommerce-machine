import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { InvitationModel } from '../models/Invitation';
import { TenantMembershipModel } from '../models/TenantMembership';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';
import { EntitlementService } from './entitlement.service';
import { SecurityService } from './security.service';
import { RbacService } from './rbac.service';
import { mailProvider } from '../utils/mail.provider';
import { AppError } from '../middleware/error';
import { env } from '@sellzy/config';
import { SystemEvents } from '@sellzy/shared';

export class InvitationService {
  static async inviteMember(tenantId: string, email: string, role: string, invitedByUserId: string) {
    // 1. Verify inviter active status in tenant
    const inviterUser = await UserModel.findOne({ _id: invitedByUserId });
    if (!inviterUser || inviterUser.status === 'SUSPENDED' || inviterUser.status === 'DISABLED' || inviterUser.status === 'LOCKED') {
      throw new AppError('Inviter account is inactive or disabled', 403, 'ACCOUNT_DISABLED');
    }

    const inviterMembership = await TenantMembershipModel.findOne({ tenantId, userId: invitedByUserId, status: 'ACTIVE' });
    if (!inviterMembership) {
      throw new AppError('Inviter does not have an active membership in this tenant', 403, 'FORBIDDEN');
    }

    // 2. Validate role & permission ceiling
    if (role === 'PLATFORM_ADMIN' || role === 'SUPER_ADMIN') {
      throw new AppError('Cannot invite platform administration roles', 403, 'FORBIDDEN_ROLE');
    }

    if ((role === 'Owner' || role === 'OWNER') && !inviterMembership.isOwner) {
      throw new AppError('Only the Tenant Owner can invite another Owner', 403, 'FORBIDDEN_ROLE');
    }

    // Permission ceiling check against target role permissions
    const targetRole = await RoleModel.findOne({
      tenantId,
      name: role,
      archivedAt: { $exists: false }
    });

    if (targetRole) {
      await RbacService.validatePermissionCeiling(invitedByUserId, tenantId, targetRole.permissions);
    }

    // 3. Check maxUsers limit entitlement
    const canAddUser = await EntitlementService.checkTenantLimit(tenantId, 'maxUsers', 1);
    if (!canAddUser) {
      throw new AppError('Plan user limit reached. Upgrade plan to invite more team members.', 403, 'LIMIT_EXCEEDED');
    }

    // 4. Check existing membership or pending invitation
    const existingUser = await UserModel.findOne({ tenantId, email });
    if (existingUser) {
      const existingMembership = await TenantMembershipModel.findOne({ tenantId, userId: existingUser._id, status: 'ACTIVE' });
      if (existingMembership) {
        throw new AppError('User already belongs to this store', 400, 'USER_EXISTS');
      }
    }

    const existingPending = await InvitationModel.findOne({ tenantId, email, status: 'PENDING' });
    if (existingPending) {
      // Cooldown rate limiting check (60 seconds)
      const lastSent = (existingPending as any).updatedAt || (existingPending as any).createdAt || new Date();
      const secondsAgo = (Date.now() - new Date(lastSent).getTime()) / 1000;
      if (secondsAgo < 60) {
        throw new AppError('Invitation was recently sent. Please wait before resending.', 429, 'RATE_LIMITED');
      }
    }

    const plainToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    let invitation;
    if (existingPending) {
      existingPending.tokenHash = tokenHash;
      existingPending.role = role;
      existingPending.expiresAt = expiresAt;
      existingPending.invitedBy = invitedByUserId;
      await existingPending.save();
      invitation = existingPending;
    } else {
      invitation = await InvitationModel.create({
        tenantId,
        email,
        role,
        tokenHash,
        expiresAt,
        invitedBy: invitedByUserId,
        status: 'PENDING'
      });
    }

    const inviteUrl = `${env.CORS_ORIGIN}/accept-invitation?token=${plainToken}`;
    await mailProvider.sendEmail(
      email,
      'Invitation to Join Sellzy Team',
      `<p>You have been invited to join a Sellzy ecommerce team as ${role}:</p><a href="${inviteUrl}">${inviteUrl}</a>`
    );

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: invitedByUserId,
      action: SystemEvents.MEMBER_INVITED,
      metadata: { email, role }
    });

    return { id: invitation._id, email: invitation.email, role: invitation.role, expiresAt: invitation.expiresAt };
  }

  static async revokeInvitation(tenantId: string, invitationId: string, actorUserId: string) {
    const invitation = await InvitationModel.findOne({ _id: invitationId, tenantId, status: 'PENDING' });
    if (!invitation) {
      throw new AppError('Pending invitation not found', 404, 'NOT_FOUND');
    }

    invitation.status = 'REVOKED';
    await invitation.save();

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId,
      action: 'INVITATION_REVOKED',
      metadata: { email: invitation.email }
    });
  }

  static async acceptInvitation(plainToken: string, name: string, passwordHash: string) {
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    const invitation = await InvitationModel.findOne({ tokenHash, status: 'PENDING' });
    if (!invitation) {
      throw new AppError('Invalid or expired invitation token', 400, 'INVALID_TOKEN');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'EXPIRED';
      await invitation.save();
      throw new AppError('Invitation token has expired', 400, 'EXPIRED_TOKEN');
    }

    const tenantId = invitation.tenantId;
    let user = await UserModel.findOne({ email: invitation.email });
    if (!user) {
      user = await UserModel.create({
        tenantId,
        email: invitation.email,
        name,
        passwordHash,
        status: 'ACTIVE',
        roles: [invitation.role]
      });
    }

    await TenantMembershipModel.create({
      tenantId,
      userId: user._id,
      roles: [invitation.role],
      isOwner: invitation.role === 'Owner' || invitation.role === 'OWNER',
      status: 'ACTIVE',
      joinedAt: new Date()
    });

    invitation.status = 'ACCEPTED';
    await invitation.save();

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: String(user._id),
      action: SystemEvents.MEMBER_JOINED,
      metadata: { email: invitation.email, role: invitation.role }
    });

    return user;
  }

  static async getTenantMembers(tenantId: string) {
    const memberships = await TenantMembershipModel.find({ tenantId, status: 'ACTIVE' });
    const userIds = memberships.map(m => m.userId);
    const users = await UserModel.find({ _id: { $in: userIds } });

    return memberships.map(m => {
      const u = users.find(user => user._id.toString() === m.userId);
      return {
        id: m._id,
        userId: m.userId,
        name: u?.name || 'Unknown User',
        email: u?.email || 'N/A',
        roles: m.roles,
        isOwner: m.isOwner,
        joinedAt: m.joinedAt
      };
    });
  }
}
