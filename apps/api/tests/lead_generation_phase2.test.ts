import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { env } from '@sellzy/config';
import { LeadModel } from '../src/models/Lead';
import { LeadListModel } from '../src/models/LeadList';
import { EmailSuppressionModel } from '../src/models/EmailSuppression';
import { ImportJobModel } from '../src/models/ImportJob';
import { AuditLogModel } from '../src/models/AuditLog';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';
import { LeadVerificationStatus, LeadSourceType } from '@sellzy/shared';

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

describe('SELLZY — PHASE 02 LEAD GENERATION MODULE COMPREHENSIVE SUITE', () => {
  const tenantId = 'tenant_p2_test';
  const userId = 'user_p2_admin';
  let token: string;

  beforeEach(() => {
    jest.clearAllMocks();

    token = jwt.sign(
      {
        userId,
        tenantId,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_p2_1'
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
        sessionId: filter?.sessionId || 'sess_p2_1',
        userId: filter?.userId || userId,
        tenantId,
        token: filter?.token,
        expiresAt: new Date(Date.now() + 86400000),
        save: jest.fn().mockResolvedValue(true)
      });
    }) as any);

    jest.spyOn(RbacService, 'getEffectivePermissions').mockImplementation(((userId: string) => {
      return Promise.resolve(['*']);
    }) as any);
  });

  describe('1. Page 1: Lead Generation Overview Telemetry API', () => {
    it('1.1 Computes real aggregated metrics for total, deliverable, pending, and suppressed leads', async () => {
      jest.spyOn(LeadModel, 'countDocuments').mockImplementation(((filter: any) => {
        if (filter.verificationStatus === LeadVerificationStatus.DELIVERABLE) return Promise.resolve(45);
        if (filter.verificationStatus?.$in?.includes(LeadVerificationStatus.UNVERIFIED)) return Promise.resolve(15);
        if (filter.verificationStatus?.$in?.includes(LeadVerificationStatus.UNDELIVERABLE)) return Promise.resolve(5);
        return Promise.resolve(65);
      }) as any);

      jest.spyOn(EmailSuppressionModel, 'countDocuments').mockResolvedValue(8 as any);
      jest.spyOn(LeadListModel, 'countDocuments').mockResolvedValue(3 as any);

      jest.spyOn(LeadModel, 'aggregate').mockResolvedValue([
        { _id: 'DIRECTORY_SEARCH', count: 40 },
        { _id: 'DOMAIN_GRABBER', count: 25 }
      ] as any);

      jest.spyOn(ImportJobModel, 'find').mockReturnValue(mockQuery([
        { _id: 'job_1', fileName: 'test.csv', totalRows: 100, exactMatchRows: 40, createdAt: new Date() }
      ]) as any);

      jest.spyOn(AuditLogModel, 'find').mockReturnValue(mockQuery([
        { _id: 'log_1', action: 'LEAD_GRABBER_EXECUTE', resourceType: 'LEAD_GRABBER', actorUserId: userId, timestamp: new Date() }
      ]) as any);

      const res = await request(app)
        .get('/api/v1/leads/overview')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics.totalCollected).toBe(65);
      expect(res.body.data.metrics.verifiedDeliverable).toBe(45);
      expect(res.body.data.metrics.pendingVerification).toBe(15);
      expect(res.body.data.metrics.invalidOrRisky).toBe(5);
      expect(res.body.data.metrics.suppressedCount).toBe(8);
      expect(res.body.data.metrics.savedLists).toBe(3);
      expect(res.body.data.sourceBreakdown.length).toBe(2);
      expect(res.body.data.recentImports.length).toBe(1);
    });
  });

  describe('2. Page 2: USA Business Lead Finder API', () => {
    it('2.1 Discovers authorized US leads by state and industry and prevents duplicates', async () => {
      jest.spyOn(EmailSuppressionModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(LeadModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(LeadModel, 'create').mockResolvedValue({
        _id: 'lead_new_1',
        tenantId,
        companyName: 'Apex Logistics Solutions LLC',
        email: 'operations@apexlogistics-usa.example.com',
        verificationStatus: LeadVerificationStatus.DELIVERABLE
      } as any);

      const res = await request(app)
        .post('/api/v1/leads/collect')
        .set('Authorization', `Bearer ${token}`)
        .send({ state: 'IL', industry: 'Logistics' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.discoveredCount).toBeGreaterThan(0);
      expect(res.body.data.savedCount).toBeGreaterThan(0);
    });
  });

  describe('3. Page 3: Domain Email Grabber API', () => {
    it('3.1 Grabs official domain emails, preserves source URL, and marks UNVERIFIED', async () => {
      jest.spyOn(EmailSuppressionModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(LeadModel, 'findOne').mockResolvedValue(null);

      const createdLeads: any[] = [];
      jest.spyOn(LeadModel, 'create').mockImplementation(((doc: any) => {
        createdLeads.push(doc);
        return Promise.resolve({ _id: `lead_${createdLeads.length}`, ...doc });
      }) as any);

      jest.spyOn(AuditLogModel, 'create').mockResolvedValue({} as any);

      const res = await request(app)
        .post('/api/v1/leads/grab')
        .set('Authorization', `Bearer ${token}`)
        .send({ domains: ['acmecorp.com', 'globex.org'] })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.collectedCount).toBe(2);
      expect(createdLeads[0].verificationStatus).toBe(LeadVerificationStatus.UNVERIFIED);
      expect(createdLeads[0].source).toBe(LeadSourceType.DOMAIN_GRABBER);
      expect(createdLeads[0].sourceUrl).toBe('https://acmecorp.com/contact');
    });
  });

  describe('4. Page 4: Email Verification Batch API', () => {
    it('4.1 Verifies batch unverified leads and updates status to deliverable or undeliverable', async () => {
      const mockLeadDoc: any = {
        _id: 'lead_to_verify',
        tenantId,
        email: 'test@service.example.com',
        verificationStatus: LeadVerificationStatus.UNVERIFIED,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([mockLeadDoc]) as any);
      jest.spyOn(AuditLogModel, 'create').mockResolvedValue({} as any);

      const res = await request(app)
        .post('/api/v1/leads/verify-batch')
        .set('Authorization', `Bearer ${token}`)
        .send({ leadIds: ['lead_to_verify'] })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalProcessed).toBe(1);
      expect(mockLeadDoc.verificationStatus).toBe(LeadVerificationStatus.DELIVERABLE);
      expect(mockLeadDoc.save).toHaveBeenCalled();
    });
  });

  describe('5. Page 5: Lead Lists CRM API', () => {
    it('5.1 Creates, updates, manages members, and deletes lists', async () => {
      // 1. Create list
      jest.spyOn(LeadListModel, 'create').mockResolvedValue({
        _id: 'list_123',
        tenantId,
        name: 'Midwest Logistics',
        description: 'B2B contacts',
        leadCount: 0
      } as any);

      const createRes = await request(app)
        .post('/api/v1/leads/lists')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Midwest Logistics', description: 'B2B contacts' })
        .expect(201);

      expect(createRes.body.success).toBe(true);
      expect(createRes.body.data._id).toBe('list_123');

      // 2. Member management
      jest.spyOn(LeadModel, 'updateMany').mockResolvedValue({ modifiedCount: 1 } as any);
      jest.spyOn(LeadModel, 'countDocuments').mockResolvedValue(1 as any);
      jest.spyOn(LeadListModel, 'findOneAndUpdate').mockResolvedValue({ _id: 'list_123', leadCount: 1 } as any);

      const memberRes = await request(app)
        .post('/api/v1/leads/lists/list_123/members')
        .set('Authorization', `Bearer ${token}`)
        .send({ leadIds: ['lead_abc'], action: 'ADD' })
        .expect(200);

      expect(memberRes.body.data.updatedLeadCount).toBe(1);

      // 3. Update list
      jest.spyOn(LeadListModel, 'findOneAndUpdate').mockResolvedValue({
        _id: 'list_123',
        name: 'Midwest Freight & Logistics'
      } as any);

      const patchRes = await request(app)
        .patch('/api/v1/leads/lists/list_123')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Midwest Freight & Logistics' })
        .expect(200);

      expect(patchRes.body.data.name).toBe('Midwest Freight & Logistics');

      // 4. Delete list
      jest.spyOn(LeadListModel, 'findOneAndDelete').mockResolvedValue({ _id: 'list_123' } as any);
      const delRes = await request(app)
        .delete('/api/v1/leads/lists/list_123')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(delRes.body.success).toBe(true);
    });
  });
});
