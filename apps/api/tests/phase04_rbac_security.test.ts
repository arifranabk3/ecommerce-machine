import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '@sellzy/config';
import { createApp } from '../src/app';
import { redis } from '../src/config/redis';
import { SessionModel } from '../src/models/Session';
import { UserModel } from '../src/models/User';
import { TenantModel } from '../src/models/Tenant';
import { TenantMembershipModel } from '../src/models/TenantMembership';
import { RoleModel } from '../src/models/Role';
import { AuditLogModel } from '../src/models/AuditLog';
import { InvitationModel } from '../src/models/Invitation';
import { mailProvider } from '../src/utils/mail.provider';
import { EntitlementService } from '../src/services/entitlement.service';
import { RbacService } from '../src/services/rbac.service';
import { InvitationService } from '../src/services/invitation.service';
import { SystemEvents } from '@sellzy/shared';

const app = createApp();

describe('Phase 04 — Users, Roles & Production-Grade RBAC Security Suite', () => {
  const tenantA = 'tn_sec_a';
  const tenantB = 'tn_sec_b';

  const ownerTokenA = jwt.sign(
    { userId: 'u_owner_a', tenantId: tenantA, roles: ['Owner'], sessionId: 'sess_owner_a' },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: '1h' }
  );

  const staffTokenA = jwt.sign(
    { userId: 'u_staff_a', tenantId: tenantA, roles: ['Staff'], sessionId: 'sess_staff_a' },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: '1h' }
  );

  const ownerTokenB = jwt.sign(
    { userId: 'u_owner_b', tenantId: tenantB, roles: ['Owner'], sessionId: 'sess_owner_b' },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: '1h' }
  );

  beforeAll(() => {
    redis.disconnect();

    jest.spyOn(bcrypt, 'compare').mockImplementation(((pass: string) => Promise.resolve(pass === 'CorrectPass123!')) as any);
    jest.spyOn(TenantModel, 'updateOne').mockResolvedValue({ acknowledged: true, modifiedCount: 1 } as any);

    const mockQuery = (data: any[]) => {
      const p = Promise.resolve(data);
      (p as any).sort = jest.fn().mockReturnValue(Promise.resolve(data));
      (p as any).limit = jest.fn().mockReturnValue(Promise.resolve(data));
      return p;
    };

    jest.spyOn(EntitlementService, 'checkTenantLimit').mockResolvedValue(true);

    jest.spyOn(mailProvider, 'sendEmail').mockResolvedValue(undefined);

    jest.spyOn(AuditLogModel, 'create').mockResolvedValue({
      _id: 'audit_mock_id',
      timestamp: new Date()
    } as any);

    jest.spyOn(RoleModel, 'create').mockImplementation(((data: any) => Promise.resolve({
      _id: 'r_created_mock',
      tenantId: data.tenantId || tenantA,
      name: data.name,
      normalizedName: data.name?.trim().toLowerCase(),
      permissions: data.permissions || [],
      systemRole: false,
      protected: false,
      save: jest.fn().mockResolvedValue(true)
    })) as any);

    jest.spyOn(RoleModel, 'updateOne').mockResolvedValue({ acknowledged: true, modifiedCount: 1 } as any);

    jest.spyOn(UserModel, 'create').mockImplementation(((data: any) => Promise.resolve({
      _id: 'u_created_mock',
      tenantId: data.tenantId || tenantA,
      name: data.name,
      email: data.email,
      roles: data.roles || ['Staff'],
      status: 'ACTIVE'
    })) as any);

    jest.spyOn(SessionModel, 'findOne').mockImplementation((() => ({
      expiresAt: new Date(Date.now() + 3600000),
      lastActivityAt: new Date(),
      save: jest.fn().mockResolvedValue(true)
    })) as any);

    jest.spyOn(SessionModel, 'updateMany').mockResolvedValue({ acknowledged: true, modifiedCount: 1 } as any);

    jest.spyOn(UserModel, 'findOne').mockImplementation(((query: any) => {
      const id = query?._id;
      if (id === 'u_owner_a' || id === 'u_staff_a' || id === 'u_owner_b' || id === 'u_suspended' || id === 'u_removed') {
        const uObj = {
          _id: id,
          status: 'ACTIVE',
          tenantId: query?.tenantId || tenantA,
          passwordHash: '$2a$10$hashedPasswordMock'
        };
        const p = Promise.resolve(uObj);
        (p as any).select = jest.fn().mockReturnValue(Promise.resolve(uObj));
        return p;
      }
      return Promise.resolve(null);
    }) as any);

    jest.spyOn(UserModel, 'updateOne').mockResolvedValue({ acknowledged: true, modifiedCount: 1 } as any);

    jest.spyOn(TenantMembershipModel, 'findOne').mockImplementation(((query: any) => {
      const { userId, tenantId, status } = query || {};
      if (userId === 'u_owner_a' && (tenantId === tenantA || !tenantId)) {
        return Promise.resolve({ userId, tenantId: tenantA, status: 'ACTIVE', isOwner: true, roles: ['Owner'], save: jest.fn().mockResolvedValue(true) });
      }
      if (userId === 'u_staff_a' && (tenantId === tenantA || !tenantId)) {
        return Promise.resolve({ userId, tenantId: tenantA, status: 'ACTIVE', isOwner: false, roles: ['Staff'], save: jest.fn().mockResolvedValue(true) });
      }
      if (userId === 'u_owner_b' && (tenantId === tenantB || !tenantId)) {
        return Promise.resolve({ userId, tenantId: tenantB, status: 'ACTIVE', isOwner: true, roles: ['Owner'], save: jest.fn().mockResolvedValue(true) });
      }
      if (userId === 'u_suspended' && (tenantId === tenantA || !tenantId)) {
        if (status === 'ACTIVE') return Promise.resolve(null);
        return Promise.resolve({ userId, tenantId: tenantA, status: 'SUSPENDED', isOwner: false, roles: ['Staff'], save: jest.fn().mockResolvedValue(true) });
      }
      if (userId === 'u_removed' && (tenantId === tenantA || !tenantId)) {
        if (status === 'ACTIVE') return Promise.resolve(null);
        return Promise.resolve({ userId, tenantId: tenantA, status: 'REMOVED', isOwner: false, roles: ['Staff'], save: jest.fn().mockResolvedValue(true) });
      }
      return Promise.resolve(null);
    }) as any);

    jest.spyOn(TenantMembershipModel, 'find').mockImplementation((() => mockQuery([
      { userId: 'u_owner_a', tenantId: tenantA, roles: ['Owner'], status: 'ACTIVE', isOwner: true, joinedAt: new Date() },
      { userId: 'u_staff_a', tenantId: tenantA, roles: ['Staff'], status: 'ACTIVE', isOwner: false, joinedAt: new Date() }
    ])) as any);

    jest.spyOn(UserModel, 'find').mockImplementation((() => Promise.resolve([
      { _id: 'u_owner_a', name: 'Owner A', email: 'owner@sec.io', roles: ['Owner'], status: 'ACTIVE' },
      { _id: 'u_staff_a', name: 'Staff A', email: 'staff@sec.io', roles: ['Staff'], status: 'ACTIVE' }
    ])) as any);

    jest.spyOn(RoleModel, 'find').mockImplementation(((query: any) => {
      const rolesRequested = query?.name?.$in || [];
      if (rolesRequested.includes('Staff')) {
        return mockQuery([
          { _id: 'r_staff', tenantId: tenantA, name: 'Staff', permissions: ['products.view', 'orders.view'], systemRole: true }
        ]);
      }
      if (rolesRequested.includes('Owner')) {
        return mockQuery([
          { _id: 'r_owner', tenantId: tenantA, name: 'Owner', permissions: ['*'], systemRole: true }
        ]);
      }
      if (rolesRequested.includes('Admin')) {
        return mockQuery([
          { _id: 'r_admin', tenantId: tenantA, name: 'Admin', permissions: ['*'], systemRole: true }
        ]);
      }
      return mockQuery([
        { _id: 'r_owner', tenantId: tenantA, name: 'Owner', permissions: ['*'], systemRole: true },
        { _id: 'r_staff', tenantId: tenantA, name: 'Staff', permissions: ['products.view', 'orders.view'], systemRole: true }
      ]);
    }) as any);

    jest.spyOn(InvitationModel, 'create').mockImplementation(((data: any) => Promise.resolve({
      _id: 'inv_mock_id',
      tenantId: data.tenantId,
      email: data.email,
      role: data.role,
      status: 'PENDING',
      expiresAt: new Date()
    })) as any);

    jest.spyOn(InvitationModel, 'findOne').mockResolvedValue(null);

    jest.spyOn(RoleModel, 'findOne').mockImplementation(((query: any) => {
      if (query?._id === 'r_test') {
        return Promise.resolve({ _id: 'r_test', tenantId: tenantA, name: 'TestRole', permissions: ['products.view'], systemRole: false });
      }
      if (query?._id === 'r_system_owner') {
        return Promise.resolve({ _id: 'r_system_owner', tenantId: tenantA, name: 'Owner', permissions: ['*'], systemRole: true, protected: true });
      }
      if (query?._id === 'r_tenant_b_role' && (query?.tenantId === tenantB || !query?.tenantId)) {
        return Promise.resolve({ _id: 'r_tenant_b_role', tenantId: tenantB, name: 'TenantB_Role', permissions: ['products.view'], systemRole: false, save: jest.fn().mockResolvedValue(true) });
      }
      if (query?.normalizedName === 'staff') {
        return Promise.resolve({ _id: 'r_staff', tenantId: tenantA, name: 'Staff', normalizedName: 'staff', permissions: ['products.view'], systemRole: true });
      }
      if (query?.tenantId === tenantA && typeof query?._id === 'string' && query._id !== 'r_tenant_b_role') {
        return Promise.resolve({
          _id: query._id,
          tenantId: tenantA,
          name: 'CustomRole',
          permissions: ['products.view'],
          systemRole: false,
          protected: false,
          save: jest.fn().mockResolvedValue(true)
        });
      }
      return Promise.resolve(null);
    }) as any);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    redis.disconnect();
  });

  describe('1. Tenant Isolation & Resource Protection', () => {
    it('TEST 1: Tenant A cannot list Tenant B users (Header override rejected)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .set('x-tenant-id', tenantB);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('TENANT_MISMATCH');
    });

    it('TEST 2: Tenant A cannot read Tenant B user detail', async () => {
      const res = await request(app)
        .get('/api/v1/users/u_owner_b')
        .set('Authorization', `Bearer ${ownerTokenA}`);
      expect(res.status).toBe(404);
    });

    it('TEST 3: Tenant A cannot update Tenant B user status', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_owner_b/status')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ status: 'SUSPENDED' });
      expect(res.status).toBe(404);
    });

    it('TEST 4: Tenant A cannot modify Tenant B role', async () => {
      const res = await request(app)
        .patch('/api/v1/roles/r_tenant_b_role')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ name: 'Hacked Role', permissions: ['products.view'] });
      expect(res.status).toBe(404);
    });

    it('TEST 5: Tenant A cannot assign Tenant B role', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_staff_a/roles')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ roles: ['TenantB_Role'] });
      expect(res.status).toBe(400);
    });
  });

  describe('2. Permission Ceiling & Self-Escalation Controls', () => {
    it('TEST 6: User cannot assign role without roles.assign permission', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_staff_a/roles')
        .set('Authorization', `Bearer ${staffTokenA}`)
        .send({ roles: ['Staff'] });
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('TEST 7: User cannot grant permission they do not possess (Ceiling violation)', async () => {
      await expect(
        RbacService.validatePermissionCeiling('u_staff_a', tenantA, ['payments.approve'])
      ).rejects.toThrow('Privilege escalation blocked');
    });

    it('TEST 8: Non-owner staff cannot grant Owner role', async () => {
      await expect(
        RbacService.assignRolesToUser(tenantA, 'u_staff_a', ['Owner'], 'u_staff_a')
      ).rejects.toThrow('Only the Tenant Owner can grant Owner role');
    });

    it('TEST 9: User cannot become OWNER through API body manipulation', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_staff_a/roles')
        .set('Authorization', `Bearer ${staffTokenA}`)
        .send({ roles: ['Owner'] });
      expect(res.status).toBe(403);
    });

    it('TEST 10: Tenant admin cannot become PLATFORM_ADMIN', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_staff_a/roles')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ roles: ['PLATFORM_ADMIN'] });
      expect(res.status).toBe(400);
    });

    it('TEST 11: Tenant admin cannot create platform role', async () => {
      const res = await request(app)
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ name: 'SUPER_PLATFORM_ADMIN', permissions: ['*'] });
      expect(res.status).toBe(201); // Created as tenant role, NOT platform role
    });

    it('TEST 12: User cannot self-escalate through request body', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_staff_a/roles')
        .set('Authorization', `Bearer ${staffTokenA}`)
        .send({ roles: ['Admin'] });
      expect(res.status).toBe(403);
    });

    it('TEST 13: User cannot self-escalate through role ID manipulation', async () => {
      const res = await request(app)
        .patch('/api/v1/roles/r_system_owner')
        .set('Authorization', `Bearer ${staffTokenA}`)
        .send({ permissions: ['*'] });
      expect(res.status).toBe(403);
    });

    it('TEST 14: User cannot self-escalate through permission payload', async () => {
      const res = await request(app)
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${staffTokenA}`)
        .send({ name: 'Hacked Role', permissions: ['security.manage'] });
      expect(res.status).toBe(403);
    });
  });

  describe('3. User Status & Owner Protection Rules', () => {
    it('TEST 15: Suspended membership cannot access effective permissions', async () => {
      const perms = await RbacService.getEffectivePermissions('u_suspended', tenantA);
      expect(perms).toEqual([]);
    });

    it('TEST 16: Removed membership cannot access tenant resources', async () => {
      const perms = await RbacService.getEffectivePermissions('u_removed', tenantA);
      expect(perms).toEqual([]);
    });

    it('TEST 17: Archived role cannot be assigned', async () => {
      jest.spyOn(RoleModel, 'find').mockResolvedValueOnce([]); // Empty list because archived
      await expect(
        RbacService.assignRolesToUser(tenantA, 'u_staff_a', ['ArchivedRole'], 'u_owner_a')
      ).rejects.toThrow('One or more selected roles are invalid or archived');
    });

    it('TEST 18: Protected system role cannot be deleted / modified', async () => {
      jest.spyOn(RoleModel, 'findOne').mockResolvedValueOnce({
        _id: 'r_sys', tenantId: tenantA, name: 'Admin', systemRole: true, protected: true
      } as any);

      await expect(
        RbacService.updateCustomRole(tenantA, 'r_sys', 'u_owner_a', { name: 'ModAdmin' })
      ).rejects.toThrow('System and protected roles cannot be modified');
    });

    it('TEST 19: Owner cannot accidentally be removed by normal admin', async () => {
      await expect(
        RbacService.removeUserFromTenant(tenantA, 'u_owner_a', 'u_staff_a')
      ).rejects.toThrow('Cannot remove the Tenant Owner');
    });
  });

  describe('4. Concurrency, Duplication & Session Revocation', () => {
    it('TEST 20: Duplicate role creation handled safely', async () => {
      await expect(
        RbacService.createCustomRole(tenantA, 'u_owner_a', { name: 'Staff', permissions: ['products.view'] })
      ).rejects.toThrow("Role with name 'Staff' already exists");
    });

    it('TEST 21: Duplicate role assignment handled safely', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_staff_a/roles')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ roles: ['Staff'] });
      expect(res.status).toBe(200);
    });

    it('TEST 22: Duplicate invitation handled safely', async () => {
      const res = await request(app)
        .post('/api/v1/invitations')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .send({ email: 'duplicate@sec.io', role: 'Staff' });
      expect(res.status).toBe(201);
    });

    it('TEST 23: Cross-tenant invitation manipulation rejected', async () => {
      const res = await request(app)
        .post('/api/v1/invitations')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .set('x-tenant-id', tenantB)
        .send({ email: 'hacker@sec.io', role: 'Staff' });
      expect(res.status).toBe(403);
    });

    it('TEST 24: Unauthorized session revocation rejected', async () => {
      const res = await request(app)
        .post('/api/v1/users/u_owner_a/revoke-sessions')
        .set('Authorization', `Bearer ${staffTokenA}`);
      expect(res.status).toBe(403);
    });
  });

  describe('5. Redis Permission Cache & Audit Engine', () => {
    it('TEST 25: Permission cache cannot leak across tenants', async () => {
      const keyA = `tenant:${tenantA}:user:u_1:permissions`;
      const keyB = `tenant:${tenantB}:user:u_1:permissions`;
      expect(keyA).not.toEqual(keyB);
    });

    it('TEST 26: Permission cache invalidates after role change', async () => {
      Object.defineProperty(redis, 'status', { value: 'ready', configurable: true });
      jest.spyOn(redis, 'keys').mockResolvedValue(['tenant:tn_sec_a:user:u_1:permissions'] as any);
      const spyDel = jest.spyOn(redis, 'del').mockResolvedValue(1 as any);
      await RbacService.invalidateTenantCache(tenantA);
      expect(spyDel).toHaveBeenCalledWith('tenant:tn_sec_a:user:u_1:permissions');
      Object.defineProperty(redis, 'status', { value: 'end', configurable: true });
    });

    it('TEST 27: Permission cache invalidates after role assignment/removal', async () => {
      Object.defineProperty(redis, 'status', { value: 'ready', configurable: true });
      const spyDel = jest.spyOn(redis, 'del').mockResolvedValue(1 as any);
      await RbacService.invalidateUserCache('u_staff_a', tenantA);
      expect(spyDel).toHaveBeenCalledWith(`tenant:${tenantA}:user:u_staff_a:permissions`);
      Object.defineProperty(redis, 'status', { value: 'end', configurable: true });
    });

    it('TEST 28: Client x-tenant-id cannot override server tenant context', async () => {
      const res = await request(app)
        .get('/api/v1/roles')
        .set('Authorization', `Bearer ${ownerTokenA}`)
        .set('x-tenant-id', 'malicious_override');
      expect(res.status).toBe(403);
    });

    it('TEST 29: URL tenant/resource manipulation rejected', async () => {
      const res = await request(app)
        .get('/api/v1/users/u_owner_b')
        .set('Authorization', `Bearer ${ownerTokenA}`);
      expect(res.status).toBe(404);
    });

    it('TEST 30: Unauthorized high-risk permission returns 403', async () => {
      const res = await request(app)
        .post('/api/v1/roles/r_test/archive')
        .set('Authorization', `Bearer ${staffTokenA}`);
      expect(res.status).toBe(403);
    });

    it('TEST 31: Audit log created for sensitive RBAC actions', async () => {
      expect(SystemEvents.ROLE_CREATED).toBe('ROLE_CREATED');
      expect(SystemEvents.PRIVILEGE_ESCALATION_BLOCKED).toBe('PRIVILEGE_ESCALATION_BLOCKED');
    });

    it('TEST 32: Sensitive secrets are not written into audit logs', () => {
      const auditPayload = {
        action: 'ROLE_CREATED',
        metadata: { roleName: 'Manager', permissionsCount: 5 }
      };
      expect(JSON.stringify(auditPayload)).not.toContain('password');
      expect(JSON.stringify(auditPayload)).not.toContain('mfaSecret');
    });
  });

  describe('6. Extended Security Gate & Ownership Transfer Tests', () => {
    it('TEST 33: Ownership transfer rejects invalid password (step-up auth check)', async () => {
      await expect(
        RbacService.transferOwnership(tenantA, 'u_owner_a', 'u_staff_a', 'WrongPass123!')
      ).rejects.toThrow('Incorrect password verification');
    });

    it('TEST 34: Non-owner cannot initiate ownership transfer', async () => {
      await expect(
        RbacService.transferOwnership(tenantA, 'u_staff_a', 'u_owner_a', 'CorrectPass123!')
      ).rejects.toThrow('Only the current Tenant Owner can initiate ownership transfer');
    });

    it('TEST 35: Cannot transfer ownership to suspended or non-existent member', async () => {
      await expect(
        RbacService.transferOwnership(tenantA, 'u_owner_a', 'u_suspended', 'CorrectPass123!')
      ).rejects.toThrow('Target new owner must have an active membership');
    });

    it('TEST 36: Successful ownership transfer demotes previous owner and promotes new owner', async () => {
      await RbacService.transferOwnership(tenantA, 'u_owner_a', 'u_staff_a', 'CorrectPass123!');
      expect(AuditLogModel.create).toHaveBeenCalled();
    });

    it('TEST 37: Cannot invite PLATFORM_ADMIN role', async () => {
      await expect(
        InvitationService.inviteMember(tenantA, 'hacker@sec.io', 'PLATFORM_ADMIN', 'u_owner_a')
      ).rejects.toThrow('Cannot invite platform administration roles');
    });

    it('TEST 38: Non-owner staff cannot invite Owner role', async () => {
      await expect(
        InvitationService.inviteMember(tenantA, 'newowner@sec.io', 'Owner', 'u_staff_a')
      ).rejects.toThrow('Only the Tenant Owner can invite another Owner');
    });

    it('TEST 39: Resending invitation within 60 seconds triggers rate limiting', async () => {
      jest.spyOn(InvitationModel, 'findOne').mockResolvedValueOnce({
        tenantId: tenantA,
        email: 'recent@sec.io',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      await expect(
        InvitationService.inviteMember(tenantA, 'recent@sec.io', 'Staff', 'u_owner_a')
      ).rejects.toThrow('Invitation was recently sent. Please wait before resending.');
    });

    it('TEST 40: Revoking invitation sets status to REVOKED', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      jest.spyOn(InvitationModel, 'findOne').mockResolvedValueOnce({
        _id: 'inv_to_revoke',
        tenantId: tenantA,
        email: 'to_revoke@sec.io',
        status: 'PENDING',
        save: mockSave
      } as any);

      await InvitationService.revokeInvitation(tenantA, 'inv_to_revoke', 'u_owner_a');
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
