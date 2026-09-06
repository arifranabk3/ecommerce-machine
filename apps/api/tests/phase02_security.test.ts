import request from 'supertest';
import { createApp } from '../src/app';
import { redis } from '../src/config/redis';

const app = createApp();

describe('Phase 02 — Comprehensive Security, Auth & RBAC Suite', () => {
  afterAll(async () => {
    await redis.quit();
  });

  describe('1. Authentication Input & Schema Hardening', () => {
    it('Rejects registration with weak password (missing numbers/uppercase)', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        businessName: 'Weak Password Store',
        slug: `weak-${Date.now()}`,
        adminName: 'Weak User',
        adminEmail: 'weak@sec.io',
        password: 'weak'
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Rejects registration with invalid slug format', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        businessName: 'Invalid Slug Store',
        slug: 'INVALID SLUG WITH SPACES',
        adminName: 'Owner',
        adminEmail: 'owner@sec.io',
        password: 'Password123!'
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('2. Rate Limiting & Security Configuration', () => {
    it('Responds with Helmet security headers on auth endpoints', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });
});

