import { AuditLogModel } from '../src/models/AuditLog';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { env } from '@sellzy/config';
import { LeadModel } from '../src/models/Lead';
import { LeadListModel } from '../src/models/LeadList';
import { CollectionJobModel } from '../src/models/CollectionJob';
import { EmailSuppressionModel } from '../src/models/EmailSuppression';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';
import { CANONICAL_LEAD_HEADERS, CollectionJobStatus, LeadVerificationStatus } from '@sellzy/shared';

const app = createApp();
const secret = env.JWT_SECRET as jwt.Secret;

function mockQuery(result: any): any {
  return {
    exec: jest.fn().mockResolvedValue(result),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    then: (resolve: any) => Promise.resolve(result).then(resolve)
  };
}

describe('SELLZY — COUNTRY-BASED EMAIL GRABBER & SENDER ENGINE SUITE', () => {
  const tenantId = 'tenant_country_test';
  const userId = 'user_country_admin';
  let token: string;

  beforeEach(() => {
    jest.clearAllMocks();

    token = jwt.sign(
      {
        userId,
        tenantId,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_country_1'
      },
      secret
    );

    jest.spyOn(UserModel, 'findOne').mockImplementation(((filter: any) => {
      return mockQuery({ _id: userId, tenantId, role: 'ADMIN', status: 'ACTIVE', isSuperAdmin: false });
    }) as any);

    jest.spyOn(UserModel, 'findById').mockImplementation(((id: any) => {
      return mockQuery({ _id: id, tenantId, role: 'ADMIN', status: 'ACTIVE', isSuperAdmin: false });
    }) as any);

    jest.spyOn(SessionModel, 'findOne').mockImplementation(((filter: any) => {
      return mockQuery({
        _id: 'sess_1',
        sessionId: filter?.sessionId || 'sess_country_1',
        userId: filter?.userId || userId,
        tenantId,
        token: filter?.token,
        expiresAt: new Date(Date.now() + 86400000),
        save: jest.fn().mockResolvedValue(true)
      });
    }) as any);

    jest.spyOn(AuditLogModel, 'create').mockResolvedValue({} as any);
    jest.spyOn(RbacService, 'getEffectivePermissions').mockImplementation(((userId: string) => {
      return Promise.resolve(['*']);
    }) as any);
  });

  describe('1. Supported Countries & Provider Registration', () => {
    it('1.1 GET /api/v1/leads/countries returns supported and unsupported country capability metadata', async () => {
      const res = await request(app)
        .get('/api/v1/leads/countries')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      const us = res.body.data.find((c: any) => c.code === 'US');
      expect(us).toBeDefined();
      expect(us.isSupported).toBe(true);

      const fr = res.body.data.find((c: any) => c.code === 'FR');
      expect(fr).toBeDefined();
      expect(fr.isSupported).toBe(false);
    });
  });

  describe('2. Start Collection Job & Provider Execution', () => {
    it('2.1 Starts collection for supported country (GB) and creates active job', async () => {
      jest.spyOn(CollectionJobModel, 'create').mockImplementation(((doc: any) => {
        return Promise.resolve({
          _id: 'job_gb_1',
          ...doc,
          save: jest.fn().mockResolvedValue(true)
        });
      }) as any);

      jest.spyOn(CollectionJobModel, 'findOne').mockReturnValue(mockQuery({
        _id: 'job_gb_1',
        tenantId,
        country: 'GB',
        status: CollectionJobStatus.QUEUED,
        save: jest.fn().mockResolvedValue(true)
      }) as any);

      const res = await request(app)
        .post('/api/v1/leads/jobs/start')
        .set('Authorization', `Bearer ${token}`)
        .send({ country: 'GB', industry: 'Technology', maxRecords: 10 })
        .expect(202);

      expect(res.body.success).toBe(true);
      expect(res.body.data.country).toBe('GB');
    });

    it('2.2 Rejects unsupported country (FR) with real error and FAILED job status', async () => {
      jest.spyOn(CollectionJobModel, 'create').mockImplementation(((doc: any) => {
        return Promise.resolve({
          _id: 'job_fr_fail',
          ...doc,
          save: jest.fn().mockResolvedValue(true)
        });
      }) as any);

      const res = await request(app)
        .post('/api/v1/leads/jobs/start')
        .set('Authorization', `Bearer ${token}`)
        .send({ country: 'FR', maxRecords: 10 })
        .expect(202);

      expect(res.body.data.status).toBe(CollectionJobStatus.FAILED);
      expect(res.body.data.errorDetails).toContain('No configured data provider supports this country');
    });
  });

  describe('3. Job Cancellation & Status Querying', () => {
    it('3.1 POST /api/v1/leads/jobs/:id/cancel cancels an active running job', async () => {
      const mockJobDoc: any = {
        _id: 'job_cancel_test',
        tenantId,
        status: CollectionJobStatus.RUNNING,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(CollectionJobModel, 'findOne').mockReturnValue(mockQuery(mockJobDoc) as any);

      const res = await request(app)
        .post('/api/v1/leads/jobs/job_cancel_test/cancel')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(mockJobDoc.status).toBe(CollectionJobStatus.CANCELLED);
    });

    it('3.2 GET /api/v1/leads/jobs/:id returns live progress and telemetry', async () => {
      jest.spyOn(CollectionJobModel, 'findOne').mockReturnValue(mockQuery({
        _id: 'job_status_test',
        tenantId,
        country: 'US',
        status: CollectionJobStatus.COMPLETED,
        progressPercentage: 100,
        recordsSaved: 20
      }) as any);

      const res = await request(app)
        .get('/api/v1/leads/jobs/job_status_test')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.progressPercentage).toBe(100);
      expect(res.body.data.recordsSaved).toBe(20);
    });
  });

  describe('4. Canonical CSV Export with Injection Sanitization', () => {
    it('4.1 Exports canonical CSV with formula protection and proper country filename', async () => {
      const mockLead = {
        _id: 'lead_csv_1',
        tenantId,
        companyName: '=cmd|/c calc!A0', // Potential CSV injection payload
        email: 'ceo@uklogistics.example.com',
        country: 'GB',
        verificationStatus: LeadVerificationStatus.DELIVERABLE
      };

      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([mockLead]) as any);

      const res = await request(app)
        .get('/api/v1/leads/export-csv?country=GB')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('Sellzy-GB-Emails-');
      
      const csvText = res.text;
      const firstLine = csvText.split('\n')[0];
      expect(firstLine).toBe(CANONICAL_LEAD_HEADERS.join(','));

      // Verify formula injection sanitization: starts with single quote
      expect(csvText).toContain("`'=cmd|/c calc!A0`".replace(/`/g, ''));
    });
  });
});
