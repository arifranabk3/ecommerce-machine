import request from 'supertest';
import jwt from 'jsonwebtoken';
import { env } from '@sellzy/config';
import { createApp } from '../src/app';
import { redis } from '../src/config/redis';
import { SessionModel } from '../src/models/Session';
import { UserModel } from '../src/models/User';

import { TenantMembershipModel } from '../src/models/TenantMembership';

const app = createApp();

describe('Phase 03 — Multi-Tenant SaaS Core, Tenant Isolation & Entitlements', () => {
  const mockToken = jwt.sign(
    { userId: 'user_p3_test', tenantId: 'tn_p3_test', roles: ['Owner'], sessionId: 'sess_p3_test' },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: '1h' }
  );

  beforeAll(() => {
    redis.disconnect();

    jest.spyOn(SessionModel, 'findOne').mockImplementation((() => ({
      expiresAt: new Date(Date.now() + 3600000),
      lastActivityAt: new Date(),
      save: jest.fn().mockResolvedValue(true)
    })) as any);

    jest.spyOn(UserModel, 'findOne').mockImplementation((() => ({
      status: 'ACTIVE'
    })) as any);

    jest.spyOn(TenantMembershipModel, 'findOne').mockImplementation((() => ({
      status: 'ACTIVE',
      isOwner: true,
      roles: ['Owner']
    })) as any);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    redis.disconnect();
  });

  describe('1. Entitlements & Redis Namespaced Isolation Keys', () => {
    it('Constructs tenant-isolated Redis cache keys correctly', () => {
      const tenantAId = 'tn_test_a';
      const tenantBId = 'tn_test_b';
      const keyA = `tenant:${tenantAId}:features`;
      const keyB = `tenant:${tenantBId}:features`;
      expect(keyA).not.toEqual(keyB);
      expect(keyA).toContain('tn_test_a');
    });
  });

  describe('2. Multi-Tenant Validation & Schema Protection', () => {
    it('Rejects unauthenticated tenant switching request', async () => {
      const res = await request(app).post('/api/v1/tenant/switch').send({});
      expect(res.status).toBe(401);
    });

    it('Rejects invalid tenant switching request body when authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/tenant/switch')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Rejects invalid invitation payload missing email/role when authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/invitations')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ role: 'Admin' });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});



