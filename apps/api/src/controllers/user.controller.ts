import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { TenantMembershipModel } from '../models/TenantMembership';
import { UserModel } from '../models/User';
import { SessionModel } from '../models/Session';
import { AuditLogModel } from '../models/AuditLog';
import { RbacService } from '../services/rbac.service';
import { assignUserRolesSchema, updateUserStatusSchema, transferOwnershipSchema } from '@sellzy/validation';
import { AppError } from '../middleware/error';

export class UserController {
  /**
   * List users/members within current tenant context.
   */
  static async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const { search, status, role } = req.query;

      const filter: Record<string, unknown> = { tenantId };
      if (status) {
        filter.status = status;
      }
      if (role) {
        filter.roles = role;
      }

      const memberships = await TenantMembershipModel.find(filter).sort({ createdAt: -1 });
      const userIds = memberships.map(m => m.userId);

      const userFilter: Record<string, unknown> = { _id: { $in: userIds } };
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        userFilter.$or = [{ name: searchRegex }, { email: searchRegex }];
      }

      const users = await UserModel.find(userFilter);
      const userMap = new Map(users.map(u => [u._id.toString(), u]));

      const results = memberships
        .filter(m => userMap.has(m.userId))
        .map(m => {
          const u = userMap.get(m.userId)!;
          return {
            id: u._id,
            membershipId: m._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            roles: m.roles,
            status: m.status,
            isOwner: m.isOwner,
            joinedAt: m.joinedAt,
            lastLoginAt: u.lastLoginAt
          };
        });

      return res.json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }

  /**
   * View user detail (Profile, Roles, Effective Permissions, Sessions, Audit Trail).
   */
  static async getUserDetail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const targetUserId = req.params.id;

      const membership = await TenantMembershipModel.findOne({ tenantId, userId: targetUserId });
      if (!membership) {
        throw new AppError('User not found in tenant', 404, 'USER_NOT_FOUND');
      }

      const user = await UserModel.findOne({ _id: targetUserId });
      if (!user) {
        throw new AppError('User record not found', 404, 'USER_NOT_FOUND');
      }

      const effectivePermissions = await RbacService.getEffectivePermissions(targetUserId, tenantId);

      const sessions = await SessionModel.find({ userId: targetUserId, tenantId, revokedAt: { $exists: false } });

      const auditTrail = await AuditLogModel.find({ tenantId, actorUserId: targetUserId }).sort({ timestamp: -1 }).limit(20);

      return res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: membership.status,
            roles: membership.roles,
            isOwner: membership.isOwner,
            mfaEnabled: user.mfaEnabled,
            joinedAt: membership.joinedAt,
            lastLoginAt: user.lastLoginAt
          },
          effectivePermissions,
          sessions: sessions.map(s => ({
            id: s._id,
            sessionId: s.sessionId,
            userAgent: s.userAgent,
            ipAddress: s.ipAddress,
            lastActivityAt: s.lastActivityAt,
            createdAt: s.createdAt
          })),
          auditTrail: auditTrail.map(a => ({
            id: a._id,
            action: a.action,
            result: a.result,
            timestamp: a.timestamp
          }))
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Assign Roles to User.
   */
  static async assignRoles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const targetUserId = req.params.id;
      const requesterUserId = req.user!.userId;

      const body = assignUserRolesSchema.parse(req.body);

      await RbacService.assignRolesToUser(tenantId, targetUserId, body.roles, requesterUserId);

      return res.json({ success: true, message: 'User roles updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update User Status (Activate / Suspend).
   */
  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const targetUserId = req.params.id;
      const requesterUserId = req.user!.userId;

      const body = updateUserStatusSchema.parse(req.body);

      if (body.status === 'REMOVED') {
        await RbacService.removeUserFromTenant(tenantId, targetUserId, requesterUserId);
      } else {
        await RbacService.updateUserMembershipStatus(tenantId, targetUserId, body.status as 'ACTIVE' | 'SUSPENDED', requesterUserId);
      }

      return res.json({ success: true, message: `User status updated to ${body.status}` });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Remove User from Tenant.
   */
  static async removeUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const targetUserId = req.params.id;
      const requesterUserId = req.user!.userId;

      await RbacService.removeUserFromTenant(tenantId, targetUserId, requesterUserId);

      return res.json({ success: true, message: 'User removed from tenant successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Revoke Active Sessions for User.
   */
  static async revokeSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const targetUserId = req.params.id;

      await SessionModel.updateMany(
        { userId: targetUserId, tenantId, revokedAt: { $exists: false } },
        { revokedAt: new Date(), revokeReason: 'REVOKED_BY_ADMIN' }
      );

      return res.json({ success: true, message: 'User sessions revoked successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Transfer Tenant Ownership.
   */
  static async transferOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const currentOwnerUserId = req.user!.userId;

      const body = transferOwnershipSchema.parse(req.body);

      await RbacService.transferOwnership(tenantId, currentOwnerUserId, body.newOwnerUserId, body.password);

      return res.json({ success: true, message: 'Ownership transferred successfully' });
    } catch (err) {
      next(err);
    }
  }
}
