import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { RoleModel } from '../models/Role';
import { TenantMembershipModel } from '../models/TenantMembership';
import { RbacService } from '../services/rbac.service';
import { PERMISSIONS_CATALOG } from '../config/permissions.catalog';
import { createRoleSchema, updateRoleSchema } from '@sellzy/validation';
import { AppError } from '../middleware/error';

export class RoleController {
  /**
   * List System & Custom Roles for Tenant.
   */
  static async listRoles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;

      const roles = await RoleModel.find({
        tenantId,
        archivedAt: { $exists: false }
      }).sort({ systemRole: -1, createdAt: 1 });

      // Get user counts for each role
      const memberships = await TenantMembershipModel.find({ tenantId, status: 'ACTIVE' });
      const roleUserCountMap = new Map<string, number>();

      for (const m of memberships) {
        for (const roleName of m.roles) {
          roleUserCountMap.set(roleName, (roleUserCountMap.get(roleName) || 0) + 1);
        }
      }

      const results = roles.map(r => ({
        id: r._id,
        name: r.name,
        description: r.description,
        permissions: r.permissions,
        permissionsCount: r.permissions.length,
        systemRole: r.systemRole,
        protected: r.protected,
        userCount: roleUserCountMap.get(r.name) || 0,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));

      return res.json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Role Detail.
   */
  static async getRoleDetail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const roleId = req.params.id;

      const role = await RoleModel.findOne({ _id: roleId, tenantId });
      if (!role) {
        throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
      }

      return res.json({
        success: true,
        data: {
          id: role._id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          systemRole: role.systemRole,
          protected: role.protected,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create Custom Role.
   */
  static async createRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const requesterUserId = req.user!.userId;

      const body = createRoleSchema.parse(req.body);

      const role = await RbacService.createCustomRole(tenantId, requesterUserId, body);

      return res.status(201).json({
        success: true,
        data: {
          id: role._id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          systemRole: role.systemRole,
          createdAt: role.createdAt
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update Custom Role.
   */
  static async updateRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const roleId = req.params.id;
      const requesterUserId = req.user!.userId;

      const body = updateRoleSchema.parse(req.body);

      const role = await RbacService.updateCustomRole(tenantId, roleId, requesterUserId, body);

      return res.json({
        success: true,
        data: {
          id: role._id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          updatedAt: role.updatedAt
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Archive Custom Role.
   */
  static async archiveRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const roleId = req.params.id;
      const requesterUserId = req.user!.userId;

      await RbacService.archiveCustomRole(tenantId, roleId, requesterUserId);

      return res.json({ success: true, message: 'Role archived successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Duplicate Role.
   */
  static async duplicateRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const roleId = req.params.id;
      const requesterUserId = req.user!.userId;

      const newRoleName = req.body.name || `Copy of Role`;

      const newRole = await RbacService.duplicateCustomRole(tenantId, roleId, requesterUserId, newRoleName);

      return res.status(201).json({
        success: true,
        data: {
          id: newRole._id,
          name: newRole.name,
          description: newRole.description,
          permissions: newRole.permissions,
          createdAt: newRole.createdAt
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * List Granular Permissions Catalog.
   */
  static async listPermissionsCatalog(_req: AuthenticatedRequest, res: Response) {
    return res.json({
      success: true,
      data: PERMISSIONS_CATALOG
    });
  }
}
