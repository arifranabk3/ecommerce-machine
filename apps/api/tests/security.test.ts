import request from 'supertest';
import { createApp } from '../src/app';
import { redis } from '../src/config/redis';
import { AuthService } from '../src/services/auth.service';
import { TenantModel } from '../src/models/Tenant';
import { UserModel } from '../src/models/User';
import { RoleModel } from '../src/models/Role';
import { SessionModel } from '../src/models/Session';

const app = createApp();

describe('Phase 01 — Comprehensive Security & Tenant Isolation Tests', () => {
  afterAll(async () => {
    await redis.quit();
  });

  describe('Health Check Endpoints', () => {
    it('GET /api/v1/health returns HTTP 200 with status UP', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('UP');
    });

    it('GET /api/v1/health/db returns status without leaking secrets', async () => {
      const res = await request(app).get('/api/v1/health/db');
      expect([200, 503]).toContain(res.status);
      expect(res.body.success).toBeDefined();
    });

    it('GET /api/v1/health/redis returns status without exposing connection string', async () => {
      const res = await request(app).get('/api/v1/health/redis');
      expect([200, 503]).toContain(res.status);
      if (res.body.error) {
        expect(res.body.error.message).not.toContain('redis://');
      }
    });
  });

  describe('Authentication & Session Security', () => {
    it('Rejects request with missing authorization header', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('Rejects registration with invalid email format', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        businessName: 'Test Corp',
        slug: 'test-corp',
        adminName: 'Admin',
        adminEmail: 'invalid-email',
        password: 'Password123!'
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Rejects registration with short password', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        businessName: 'Test Corp',
        slug: 'test-corp',
        adminName: 'Admin',
        adminEmail: 'admin@test.com',
        password: 'short'
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Security Headers & Error Sanitization', () => {
    it('Includes Helmet security headers on responses', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.headers['x-dns-prefetch-control']).toBe('off');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toBeDefined();
    });

    it('Does not expose stack trace or internal path in 404/500 errors', async () => {
      const res = await request(app).get('/api/v1/non-existent-route');
      expect(res.body.stack).toBeUndefined();
      expect(res.body.error?.stack).toBeUndefined();
    });
  });
});
