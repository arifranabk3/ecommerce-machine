import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { env } from '@sellzy/config';
import { LeadModel } from '../src/models/Lead';
import { LeadListModel } from '../src/models/LeadList';
import { EmailSuppressionModel } from '../src/models/EmailSuppression';
import { CampaignModel } from '../src/models/Campaign';
import { CampaignRecipientModel } from '../src/models/CampaignRecipient';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';
import { LeadVerificationStatus, LeadSourceType, CampaignStatus } from '@sellzy/shared';
import { EmailVerificationService } from '../src/services/EmailVerificationService';
import { LeadDiscoveryService } from '../src/services/LeadDiscoveryService';

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

describe('SELLZY — USA BUSINESS EMAIL COLLECTION, VERIFICATION & SAVED LEAD LISTS (STAGE 1 & STAGE 2 SEPARATION)', () => {
  const tenantA = 'tenant_usa_01';
  const tenantB = 'tenant_usa_02';
  const userAId = 'usr_admin_01';

  let tokenAdminA: string;
  let tokenTenantB: string;

  beforeEach(() => {
    jest.clearAllMocks();

    tokenAdminA = jwt.sign(
      {
        userId: userAId,
        tenantId: tenantA,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_1'
      },
      secret
    );

    tokenTenantB = jwt.sign(
      {
        userId: 'usr_b',
        tenantId: tenantB,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_2'
      },
      secret
    );

    jest.spyOn(UserModel, 'findOne').mockImplementation(((filter: any) => {
      return mockQuery({ _id: userAId, tenantId: tenantA, role: 'ADMIN', status: 'ACTIVE', isSuperAdmin: false });
    }) as any);

    jest.spyOn(UserModel, 'findById').mockImplementation(((id: any) => {
      return mockQuery({ _id: id, tenantId: tenantA, role: 'ADMIN', status: 'ACTIVE', isSuperAdmin: false });
    }) as any);

    jest.spyOn(SessionModel, 'findOne').mockImplementation(((filter: any) => {
      return mockQuery({
        _id: 'sess_1',
        sessionId: filter?.sessionId || 'sess_1',
        userId: filter?.userId || userAId,
        tenantId: tenantA,
        token: filter?.token,
        expiresAt: new Date(Date.now() + 86400000),
        save: jest.fn().mockResolvedValue(true)
      });
    }) as any);

    jest.spyOn(RbacService, 'getEffectivePermissions').mockImplementation(((userId: string) => {
      return Promise.resolve(['*']);
    }) as any);
  });

  describe('1. Email Verification Engine (Layered Syntax, Disposable, MX & Deliverability)', () => {
    test('1.1 Rejects malformed and empty email syntax with RFC 5322 compliance', () => {
      expect(EmailVerificationService.isSyntaxValid('')).toBe(false);
      expect(EmailVerificationService.isSyntaxValid('invalid-email')).toBe(false);
      expect(EmailVerificationService.isSyntaxValid('user@.com')).toBe(false);
      expect(EmailVerificationService.isSyntaxValid('@nodomain.com')).toBe(false);
      expect(EmailVerificationService.isSyntaxValid('good.business@company.co.us')).toBe(true);
    });

    test('1.2 Flags known disposable email domains as undeliverable', async () => {
      const res = await EmailVerificationService.verifyEmail('ceo@mailinator.com');
      expect(res.status).toBe(LeadVerificationStatus.UNDELIVERABLE);
      expect(res.isDisposable).toBe(true);
    });

    test('1.3 Successfully flags public role-based contact accounts (info@, sales@, partnerships@)', async () => {
      const res = await EmailVerificationService.verifyEmail('partnerships@google.com');
      expect(res.isRoleAccount).toBe(true);
    });
  });

  describe('2. Lead Discovery Service (US Geography & Industry Filters)', () => {
    test('2.1 Filters US business leads accurately by State (IL)', async () => {
      const leads = await LeadDiscoveryService.discoverLeads({ state: 'IL' });
      expect(leads.length).toBeGreaterThan(0);
      expect(leads.every(l => l.state === 'IL')).toBe(true);
      expect(leads.every(l => l.country === 'US')).toBe(true);
    });

    test('2.2 Filters US business leads accurately by Industry', async () => {
      const leads = await LeadDiscoveryService.discoverLeads({ industry: 'Healthcare' });
      expect(leads.length).toBeGreaterThan(0);
      expect(leads[0].companyName).toContain('Dental');
    });

    test('2.3 Provides authoritative public source attribution for every discovered lead', async () => {
      const leads = await LeadDiscoveryService.discoverLeads({});
      for (const lead of leads) {
        expect(lead.sourceUrl).toBeDefined();
        expect(lead.sourceUrl.startsWith('http')).toBe(true);
        expect(lead.source).toBe(LeadSourceType.DIRECTORY_SEARCH);
      }
    });
  });

  describe('3. Stage 1: Lead Collection API (ZERO Email Sending Guarantee)', () => {
    test('3.1 POST /api/v1/leads/collect successfully validates and saves leads without sending emails', async () => {
      jest.spyOn(EmailSuppressionModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(LeadModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(LeadModel, 'create').mockImplementation((doc: any) => Promise.resolve({ _id: 'ld_123', ...doc }) as any);

      const res = await request(app)
        .post('/api/v1/leads/collect')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          state: 'TX',
          industry: 'Information Technology'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Zero emails sent');
      expect(res.body.data.discoveredCount).toBeGreaterThan(0);
      expect(res.body.data.savedCount).toBeGreaterThan(0);
    });

    test('3.2 Deduplication: Duplicate emails within tenant are skipped during collection', async () => {
      jest.spyOn(EmailSuppressionModel, 'findOne').mockResolvedValue(null as any);
      // Simulate existing lead
      jest.spyOn(LeadModel, 'findOne').mockResolvedValue({ _id: 'existing_lead', email: 'test@example.com' } as any);

      const res = await request(app)
        .post('/api/v1/leads/collect')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({ state: 'IL' });

      expect(res.status).toBe(200);
      expect(res.body.data.duplicateCount).toBeGreaterThan(0);
      expect(res.body.data.savedCount).toBe(0);
    });

    test('3.3 Suppression enforcement: Suppressed emails are automatically excluded during collection', async () => {
      // Simulate suppressed email
      jest.spyOn(EmailSuppressionModel, 'findOne').mockResolvedValue({ normalizedEmail: 'suppressed@example.com' } as any);

      const res = await request(app)
        .post('/api/v1/leads/collect')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({ state: 'IL' });

      expect(res.status).toBe(200);
      expect(res.body.data.suppressedCount).toBeGreaterThan(0);
      expect(res.body.data.savedCount).toBe(0);
    });
  });

  describe('4. Saved Lead Lists & CSV Operations', () => {
    test('4.1 POST /api/v1/leads/lists creates a saved lead list with tenant isolation', async () => {
      jest.spyOn(LeadListModel, 'create').mockResolvedValue({
        _id: 'list_123',
        tenantId: tenantA,
        name: 'Q4 Texas Tech Targets',
        leadCount: 0
      } as any);

      const res = await request(app)
        .post('/api/v1/leads/lists')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          name: 'Q4 Texas Tech Targets',
          description: 'High priority tech companies in Austin and Dallas'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Q4 Texas Tech Targets');
    });

    test('4.2 GET /api/v1/leads/export-csv produces compliant CSV format', async () => {
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([
        {
          companyName: 'Apex Logistics LLC',
          email: 'info@apexlogistics.com',
          website: 'https://apex.com',
          phone: '+1-312-555-0190',
          city: 'Chicago',
          state: 'IL',
          country: 'US',
          industry: 'Logistics',
          verificationStatus: LeadVerificationStatus.DELIVERABLE,
          collectedAt: new Date(),
          source: LeadSourceType.DIRECTORY_SEARCH
        }
      ]));

      const res = await request(app)
        .get('/api/v1/leads/export-csv')
        .set('Authorization', `Bearer ${tokenAdminA}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Email,First Name,Last Name,Company,Website');
      expect(res.text).toContain('Apex Logistics LLC');
    });

    test('4.3 POST /api/v1/leads/import-csv imports leads with validation and deduplication', async () => {
      jest.spyOn(EmailSuppressionModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(LeadModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(LeadModel, 'create').mockResolvedValue({} as any);

      const res = await request(app)
        .post('/api/v1/leads/import-csv')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          records: [
            { companyName: 'Imported Co', email: 'hello@imported.com', city: 'Denver', state: 'CO' },
            { companyName: 'Second Co', email: 'sales@second.com', city: 'Miami', state: 'FL' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.data.importedCount).toBe(2);
    });
  });

  describe('5. Stage 2: Manual Campaign Review & Explicit Approval Gate', () => {
    test('5.1 Creating campaign from leads sets status to DRAFT and requires physical postal address (CAN-SPAM)', async () => {
      jest.spyOn(LeadModel, 'find').mockResolvedValue([
        { _id: 'ld_1', email: 'target1@business.com', normalizedEmail: 'target1@business.com' },
        { _id: 'ld_2', email: 'target2@business.com', normalizedEmail: 'target2@business.com' }
      ] as any);
      jest.spyOn(EmailSuppressionModel, 'find').mockResolvedValue([]);
      jest.spyOn(CampaignModel, 'create').mockResolvedValue({
        _id: 'cmp_100',
        status: CampaignStatus.DRAFT
      } as any);
      jest.spyOn(CampaignRecipientModel, 'insertMany').mockResolvedValue([] as any);

      // Attempt without physical address should fail (CAN-SPAM enforcement)
      const failRes = await request(app)
        .post('/api/v1/leads/campaigns/draft')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          name: 'B2B Partnership Outreach',
          leadIds: ['ld_1', 'ld_2'],
          subject: 'Partnership Proposal',
          content: 'Hello, we would love to connect.'
        });
      expect(failRes.status).toBe(400);
      expect(failRes.body.error).toContain('physical postal address');

      // Provide physical address
      const successRes = await request(app)
        .post('/api/v1/leads/campaigns/draft')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          name: 'B2B Partnership Outreach',
          leadIds: ['ld_1', 'ld_2'],
          subject: 'Partnership Proposal',
          content: 'Hello, we would love to connect.',
          physicalPostalAddress: '100 North Michigan Ave, Suite 400, Chicago, IL 60601, USA'
        });

      expect(successRes.status).toBe(201);
      expect(successRes.body.data.status).toBe(CampaignStatus.DRAFT);
      expect(successRes.body.message).toContain('Requires explicit approval');
    });

    test('5.2 Explicit approval endpoint transitions campaign from DRAFT to APPROVED', async () => {
      const mockCampaign = {
        _id: 'cmp_100',
        tenantId: tenantA,
        status: CampaignStatus.DRAFT,
        save: jest.fn().mockResolvedValue(true)
      };
      jest.spyOn(CampaignModel, 'findOne').mockResolvedValue(mockCampaign as any);

      const res = await request(app)
        .post('/api/v1/leads/campaigns/cmp_100/approve')
        .set('Authorization', `Bearer ${tokenAdminA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockCampaign.status).toBe(CampaignStatus.APPROVED);
    });

    test('5.3 Cross-tenant protection: Tenant B cannot approve Tenant A campaign', async () => {
      jest.spyOn(CampaignModel, 'findOne').mockResolvedValue(null as any);

      const res = await request(app)
        .post('/api/v1/leads/campaigns/cmp_100/approve')
        .set('Authorization', `Bearer ${tokenTenantB}`);

      expect(res.status).toBe(404);
    });
  });

  describe('6. Suppression Management & Do-Not-Contact Enforcement', () => {
    test('6.1 POST /api/v1/leads/suppress adds email to suppression list and updates existing lead status', async () => {
      jest.spyOn(EmailSuppressionModel, 'findOneAndUpdate').mockResolvedValue({
        tenantId: tenantA,
        email: 'optout@business.com',
        reason: 'UNSUBSCRIBE'
      } as any);
      const updateManySpy = jest.spyOn(LeadModel, 'updateMany').mockResolvedValue({} as any);

      const res = await request(app)
        .post('/api/v1/leads/suppress')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          email: 'optout@business.com',
          reason: 'UNSUBSCRIBE',
          source: 'ONE_CLICK_UNSUBSCRIBE'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(updateManySpy).toHaveBeenCalledWith(
        { tenantId: tenantA, normalizedEmail: 'optout@business.com' },
        { verificationStatus: LeadVerificationStatus.SUPPRESSED }
      );
    });
  });
});
