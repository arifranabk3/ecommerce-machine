import bcrypt from 'bcryptjs';
import { RoleModel, IRoleDocument } from '../models/Role';
import { TenantMembershipModel } from '../models/TenantMembership';
import { UserModel } from '../models/User';
import { TenantModel } from '../models/Tenant';
import { SessionModel } from '../models/Session';
import { redis } from '../config/redis';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';
import { PERMISSIONS_CATALOG, ALL_PERMISSION_KEYS } from '../config/permissions.catalog';
import { CreateRoleInput, UpdateRoleInput } from '@sellzy/validation';
import { SystemEvents } from '@sellzy/shared';

export class RbacService {
  /**
   * Resolves effective permissions for a user within a specific tenant context.
   * Leverages tenant-isolated Redis caching with automated invalidation.
   */
  static async getEffectivePermissions(userId: string, tenantId: string): Promise<string[]> {
    const cacheKey = `tenant:${tenantId}:user:${userId}:permissions`;
    
    if (redis.status === 'ready') {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (_e) {}
    }

    // 1. Verify User Account Status
    const user = await UserModel.findOne({ _id: userId });
    if (!user || user.status === 'SUSPENDED' || user.status === 'DISABLED' || user.status === 'LOCKED') {
      return [];
    }

    // 2. Verify Active Tenant Membership
    const membership = await TenantMembershipModel.findOne({
      userId,
      tenantId,
      status: 'ACTIVE'
    });

    if (!membership) {
      return [];
    }

    // 3. Check Owner Authority
    if (membership.isOwner || membership.roles.includes('Owner') || membership.roles.includes('OWNER')) {
      const allPermissions = ['*', ...ALL_PERMISSION_KEYS];
      if (redis.status === 'ready') {
        try {
          await redis.setex(cacheKey, 300, JSON.stringify(allPermissions));
        } catch (_e) {}
      }
      return allPermissions;
    }

    // 4. Load Active System & Custom Roles
    const roles = await RoleModel.find({
      tenantId,
      name: { $in: membership.roles },
      archivedAt: { $exists: false }
    });

    const permissionSet = new Set<string>();
    for (const role of roles) {
      for (const perm of role.permissions) {
        permissionSet.add(perm);
      }
    }

    const effectivePermissions = Array.from(permissionSet);

    if (redis.status === 'ready') {
      try {
        await redis.setex(cacheKey, 300, JSON.stringify(effectivePermissions));
      } catch (_e) {}
    }

    return effectivePermissions;
  }

  /**
   * Invalidates Redis permission cache for a single user in a tenant.
   */
  static async invalidateUserCache(userId: string, tenantId: string): Promise<void> {
    if (redis.status === 'ready') {
      try {
        await redis.del(`tenant:${tenantId}:user:${userId}:permissions`);
      } catch (_e) {}
    }
  }

  /**
   * Invalidates all permission caches for a tenant (e.g. after a role update).
   */
  static async invalidateTenantCache(tenantId: string): Promise<void> {
    if (redis.status === 'ready') {
      try {
        const keys = await redis.keys(`tenant:${tenantId}:user:*:permissions`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } catch (_e) {}
    }
  }

  /**
   * Enforces Permission Ceiling:
   * Requester can only grant/create roles containing permissions they currently possess.
   */
  static async validatePermissionCeiling(
    requesterUserId: string,
    tenantId: string,
    targetPermissions: string[]
  ): Promise<void> {
    const requesterPermissions = await this.getEffectivePermissions(requesterUserId, tenantId);

    // Owners have universal ceiling
    if (requesterPermissions.includes('*')) {
      return;
    }

    const illegalPermissions = targetPermissions.filter(p => !requesterPermissions.includes(p));

    if (illegalPermissions.length > 0) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId: requesterUserId,
        action: SystemEvents.PRIVILEGE_ESCALATION_BLOCKED,
        metadata: { illegalPermissions }
      });

      throw new AppError(
        `Privilege escalation blocked: You do not possess permissions [${illegalPermissions.join(', ')}]`,
        403,
        'PRIVILEGE_ESCALATION_BLOCKED'
      );
    }
  }

  /**
   * Create a Custom Role.
   */
  static async createCustomRole(
    tenantId: string,
    requesterUserId: string,
    input: CreateRoleInput
  ): Promise<IRoleDocument> {
    // 1. Validate Permission Ceiling
    await this.validatePermissionCeiling(requesterUserId, tenantId, input.permissions);

    const normalizedName = input.name.trim().toLowerCase();

    // 2. Check for duplicate role name within tenant
    const existing = await RoleModel.findOne({ tenantId, normalizedName, archivedAt: { $exists: false } });
    if (existing) {
      throw new AppError(`Role with name '${input.name}' already exists`, 400, 'ROLE_ALREADY_EXISTS');
    }

    const role = await RoleModel.create({
      tenantId,
      name: input.name.trim(),
      normalizedName,
      description: input.description,
      permissions: input.permissions,
      systemRole: false,
      protected: false,
      createdBy: requesterUserId,
      updatedBy: requesterUserId
    });

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: requesterUserId,
      action: SystemEvents.ROLE_CREATED,
      metadata: { roleId: role._id, roleName: role.name, permissionsCount: role.permissions.length }
    });

    return role;
  }

  /**
   * Update a Custom Role.
   */
  static async updateCustomRole(
    tenantId: string,
    roleId: string,
    requesterUserId: string,
    input: UpdateRoleInput
  ): Promise<IRoleDocument> {
    const role = await RoleModel.findOne({ _id: roleId, tenantId });
    if (!role) {
      throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
    }

    if (role.systemRole || role.protected) {
      throw new AppError('System and protected roles cannot be modified', 403, 'PROTECTED_ROLE_IMMUTABLE');
    }

    if (input.permissions) {
      await this.validatePermissionCeiling(requesterUserId, tenantId, input.permissions);
      role.permissions = input.permissions;
    }

    if (input.name) {
      const normalizedName = input.name.trim().toLowerCase();
      const existing = await RoleModel.findOne({ tenantId, normalizedName, _id: { $ne: roleId }, archivedAt: { $exists: false } });
      if (existing) {
        throw new AppError(`Role with name '${input.name}' already exists`, 400, 'ROLE_ALREADY_EXISTS');
      }
      role.name = input.name.trim();
      role.normalizedName = normalizedName;
    }

    if (input.description !== undefined) {
      role.description = input.description;
    }

    role.updatedBy = requesterUserId;
    await role.save();

    // Invalidate cached permissions across the tenant
    await this.invalidateTenantCache(tenantId);

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: requesterUserId,
      action: SystemEvents.ROLE_UPDATED,
      metadata: { roleId: role._id, roleName: role.name }
    });

    return role;
  }

  /**
   * Archive a Custom Role.
   */
  static async archiveCustomRole(
    tenantId: string,
    roleId: string,
    requesterUserId: string
  ): Promise<void> {
    const role = await RoleModel.findOne({ _id: roleId, tenantId });
    if (!role) {
      throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
    }

    if (role.systemRole || role.protected) {
      throw new AppError('System and protected roles cannot be archived', 403, 'PROTECTED_ROLE_IMMUTABLE');
    }

    role.archivedAt = new Date();
    role.updatedBy = requesterUserId;
    await role.save();

    await this.invalidateTenantCache(tenantId);

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: requesterUserId,
      action: SystemEvents.ROLE_ARCHIVED,
      metadata: { roleId: role._id, roleName: role.name }
    });
  }

  /**
   * Duplicate an existing Role.
   */
  static async duplicateCustomRole(
    tenantId: string,
    roleId: string,
    requesterUserId: string,
    newRoleName: string
  ): Promise<IRoleDocument> {
    const sourceRole = await RoleModel.findOne({ _id: roleId, tenantId });
    if (!sourceRole) {
      throw new AppError('Source role not found', 404, 'ROLE_NOT_FOUND');
    }

    return this.createCustomRole(tenantId, requesterUserId, {
      name: newRoleName,
      description: `Copy of ${sourceRole.name}`,
      permissions: sourceRole.permissions
    });
  }

  /**
   * Assign Roles to a Tenant User.
   */
  static async assignRolesToUser(
    tenantId: string,
    targetUserId: string,
    targetRoleNames: string[],
    requesterUserId: string
  ): Promise<void> {
    // 1. Prevent non-owners from assigning Owner role
    const isAssigningOwner = targetRoleNames.some(r => r.toLowerCase() === 'owner');
    const requesterPermissions = await this.getEffectivePermissions(requesterUserId, tenantId);

    if (isAssigningOwner && !requesterPermissions.includes('*')) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId: requesterUserId,
        action: SystemEvents.UNAUTHORIZED_ROLE_ASSIGNMENT_ATTEMPT,
        metadata: { targetUserId, attemptedRoles: targetRoleNames }
      });
      throw new AppError('Only the Tenant Owner can grant Owner role', 403, 'OWNER_PROTECTION_VIOLATION');
    }

    // 2. Load target roles and ensure none are archived
    const activeRoles = await RoleModel.find({
      tenantId,
      name: { $in: targetRoleNames },
      archivedAt: { $exists: false }
    });

    if (activeRoles.length !== targetRoleNames.length) {
      throw new AppError('One or more selected roles are invalid or archived', 400, 'INVALID_ROLE');
    }

    // 3. Verify Permission Ceiling for all combined permissions in target roles
    const targetPermissions = Array.from(new Set(activeRoles.flatMap(r => r.permissions)));
    await this.validatePermissionCeiling(requesterUserId, tenantId, targetPermissions);

    // 4. Update TenantMembership
    const membership = await TenantMembershipModel.findOne({ tenantId, userId: targetUserId });
    if (!membership) {
      throw new AppError('User membership not found', 404, 'USER_NOT_FOUND');
    }

    // Owner protection: cannot strip Owner role from tenant owner
    if (membership.isOwner && !isAssigningOwner) {
      throw new AppError('Cannot remove Owner role from the Tenant Owner', 403, 'OWNER_PROTECTION_VIOLATION');
    }

    membership.roles = targetRoleNames;
    await membership.save();

    // Also sync User.roles if matching primary tenant
    await UserModel.updateOne({ _id: targetUserId, tenantId }, { roles: targetRoleNames });

    // Invalidate target user cache
    await this.invalidateUserCache(targetUserId, tenantId);

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: requesterUserId,
      action: SystemEvents.ROLE_ASSIGNED,
      metadata: { targetUserId, assignedRoles: targetRoleNames }
    });
  }

  /**
   * Update Membership Status (Activate / Suspend).
   */
  static async updateUserMembershipStatus(
    tenantId: string,
    targetUserId: string,
    newStatus: 'ACTIVE' | 'SUSPENDED',
    requesterUserId: string
  ): Promise<void> {
    const membership = await TenantMembershipModel.findOne({ tenantId, userId: targetUserId });
    if (!membership) {
      throw new AppError('User membership not found', 404, 'USER_NOT_FOUND');
    }

    if (membership.isOwner || membership.roles?.includes('Owner') || membership.roles?.includes('OWNER')) {
      throw new AppError('Cannot suspend the Tenant Owner', 403, 'OWNER_PROTECTION_VIOLATION');
    }

    membership.status = newStatus;
    await membership.save();

    if (newStatus === 'SUSPENDED') {
      // Revoke all active sessions for target user in this tenant
      await SessionModel.updateMany(
        { userId: targetUserId, tenantId, revokedAt: { $exists: false } },
        { revokedAt: new Date(), revokeReason: 'MEMBERSHIP_SUSPENDED' }
      );
    }

    await this.invalidateUserCache(targetUserId, tenantId);

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: requesterUserId,
      action: newStatus === 'SUSPENDED' ? SystemEvents.USER_SUSPENDED : SystemEvents.USER_ACTIVATED,
      metadata: { targetUserId, newStatus }
    });
  }

  /**
   * Remove User from Tenant.
   */
  static async removeUserFromTenant(
    tenantId: string,
    targetUserId: string,
    requesterUserId: string
  ): Promise<void> {
    const membership = await TenantMembershipModel.findOne({ tenantId, userId: targetUserId });
    if (!membership) {
      throw new AppError('User membership not found', 404, 'USER_NOT_FOUND');
    }

    if (membership.isOwner || membership.roles?.includes('Owner') || membership.roles?.includes('OWNER')) {
      throw new AppError('Cannot remove the Tenant Owner', 403, 'OWNER_PROTECTION_VIOLATION');
    }

    membership.status = 'REMOVED';
    await membership.save();

    // Revoke sessions
    await SessionModel.updateMany(
      { userId: targetUserId, tenantId, revokedAt: { $exists: false } },
      { revokedAt: new Date(), revokeReason: 'MEMBERSHIP_REMOVED' }
    );

    await this.invalidateUserCache(targetUserId, tenantId);

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: requesterUserId,
      action: SystemEvents.USER_REMOVED,
      metadata: { targetUserId }
    });
  }

  /**
   * Transfer Tenant Ownership (Requires current owner authentication & step-up verification).
   */
  static async transferOwnership(
    tenantId: string,
    currentOwnerUserId: string,
    newOwnerUserId: string,
    passwordVerification: string
  ): Promise<void> {
    // Verify password for step-up auth
    const currentOwner = await UserModel.findOne({ _id: currentOwnerUserId, tenantId }).select('+passwordHash');
    if (!currentOwner) {
      throw new AppError('Current owner record not found', 404, 'USER_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(passwordVerification, currentOwner.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Incorrect password verification for ownership transfer', 400, 'INVALID_PASSWORD');
    }

    const targetMembership = await TenantMembershipModel.findOne({ tenantId, userId: newOwnerUserId, status: 'ACTIVE' });
    if (!targetMembership) {
      throw new AppError('Target new owner must have an active membership in this tenant', 400, 'INVALID_TARGET_USER');
    }

    const currentOwnerMembership = await TenantMembershipModel.findOne({ tenantId, userId: currentOwnerUserId });
    if (!currentOwnerMembership || !currentOwnerMembership.isOwner) {
      throw new AppError('Only the current Tenant Owner can initiate ownership transfer', 403, 'OWNER_PROTECTION_VIOLATION');
    }

    // Step-up safe transfer
    currentOwnerMembership.isOwner = false;
    currentOwnerMembership.roles = ['Admin'];
    await currentOwnerMembership.save();

    targetMembership.isOwner = true;
    if (!targetMembership.roles.includes('Owner')) {
      targetMembership.roles.push('Owner');
    }
    await targetMembership.save();

    // Update Tenant record ownerUserId
    await TenantModel.updateOne({ tenantId }, { ownerUserId: newOwnerUserId });

    await this.invalidateUserCache(currentOwnerUserId, tenantId);
    await this.invalidateUserCache(newOwnerUserId, tenantId);

    await SecurityService.logSecurityEvent({
      tenantId,
      actorUserId: currentOwnerUserId,
      action: SystemEvents.OWNERSHIP_TRANSFERRED,
      metadata: { previousOwner: currentOwnerUserId, newOwner: newOwnerUserId }
    });
  }
}
