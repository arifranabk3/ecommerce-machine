import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { env } from '@sellzy/config';
import { LeadModel } from '../src/models/Lead';
import { EmailSuppressionModel } from '../src/models/EmailSuppression';
import { ImportJobModel } from '../src/models/ImportJob';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';
import { MatchResultStatus, LeadVerificationStatus } from '@sellzy/shared';
import { SpreadsheetParserService } from '../src/services/SpreadsheetParserService';
import { EmailNormalizationService } from '../src/services/EmailNormalizationService';
import { LeadMatchingService } from '../src/services/LeadMatchingService';

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

describe('SELLZY — EXCEL EMAIL IMPORT + LEAD GRABBER MATCHING ENGINE TEST SUITE', () => {
  const tenantA = 'tenant_match_01';
  const tenantB = 'tenant_match_02';
  const userAId = 'usr_matcher_01';

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
        sessionId: 'sess_matcher_1'
      },
      secret
    );

    tokenTenantB = jwt.sign(
      {
        userId: 'usr_b',
        tenantId: tenantB,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_matcher_2'
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

  describe('1. Email Normalization Engine', () => {
    test('1.1 Normalizes email addresses consistently with whitespace trimming and lowercase domain', () => {
      const res = EmailNormalizationService.normalize('   John.Doe@ACME.Com   ');
      expect(res.normalized).toBe('john.doe@acme.com');
      expect(res.isValid).toBe(true);
      expect(res.domain).toBe('acme.com');
    });

    test('1.2 Preserves original email and flags malformed addresses without throwing', () => {
      const res = EmailNormalizationService.normalize('not-an-email');
      expect(res.isValid).toBe(false);
      expect(res.original).toBe('not-an-email');
    });
  });

  describe('2. Spreadsheet Parser & Formula Injection Defense', () => {
    test('2.1 Safely parses CSV string into headers and structured row records', () => {
      const csv = `Company,Email,City\nApex LLC,ops@apex.com,Chicago\nCascade Inc,info@cascade.com,Seattle`;
      const parsed = SpreadsheetParserService.parseCsv(csv);
      expect(parsed.headers).toEqual(['Company', 'Email', 'City']);
      expect(parsed.totalRows).toBe(2);
      expect(parsed.rows[0].Email).toBe('ops@apex.com');
    });

    test('2.2 Neutralizes CSV/Formula Injection attacks (=cmd, +cmd, @sum)', () => {
      expect(SpreadsheetParserService.sanitizeCellForExport('=cmd|’ /C calc’!A0')).toBe('\'=cmd|’ /C calc’!A0');
      expect(SpreadsheetParserService.sanitizeCellForExport('+12345')).toBe('\'+12345');
      expect(SpreadsheetParserService.sanitizeCellForExport('@SUM(1+1)')).toBe('\'@SUM(1+1)');
      expect(SpreadsheetParserService.sanitizeCellForExport('Safe Text')).toBe('Safe Text');
    });
  });

  describe('3. Matching Engine (Exact Match, Grabbed Only, Excel Only, Duplicates, Suppressed)', () => {
    test('3.1 Accurately identifies exact_match when email exists in CRM and Excel', async () => {
      jest.spyOn(EmailSuppressionModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([
        {
          _id: 'lead_001',
          normalizedEmail: 'ops@apex.com',
          companyName: 'Apex Logistics',
          email: 'ops@apex.com',
          website: 'https://apex.com'
        }
      ]));

      const rawRows = [
        { 'Work Email': 'ops@apex.com', 'Business': 'Apex LLC' }
      ];

      const summary = await LeadMatchingService.matchDatasets(tenantA, rawRows, { email: 'Work Email', companyName: 'Business' });

      expect(summary.exactMatchRows).toBe(1);
      expect(summary.records[0].status).toBe(MatchResultStatus.EXACT_MATCH);
      expect(summary.records[0].matchedLeadId).toBe('lead_001');
    });

    test('3.2 Accurately identifies duplicate_in_file within the uploaded spreadsheet', async () => {
      jest.spyOn(EmailSuppressionModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([]));

      const rawRows = [
        { 'Email': 'repeated@company.com' },
        { 'Email': 'repeated@company.com' }
      ];

      const summary = await LeadMatchingService.matchDatasets(tenantA, rawRows, { email: 'Email' });

      expect(summary.duplicateInFileRows).toBe(1);
      expect(summary.records[1].status).toBe(MatchResultStatus.DUPLICATE_IN_FILE);
    });

    test('3.3 Accurately identifies suppressed contacts in Excel import', async () => {
      jest.spyOn(EmailSuppressionModel, 'find').mockReturnValue(mockQuery([
        { normalizedEmail: 'unsubscribed@company.com' }
      ]));
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([]));

      const rawRows = [
        { 'Email': 'unsubscribed@company.com' }
      ];

      const summary = await LeadMatchingService.matchDatasets(tenantA, rawRows, { email: 'Email' });

      expect(summary.suppressedRows).toBe(1);
      expect(summary.records[0].status).toBe(MatchResultStatus.SUPPRESSED);
    });

    test('3.4 Identifies grabbed_only leads that exist in CRM but are missing from Excel file', async () => {
      jest.spyOn(EmailSuppressionModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([
        {
          _id: 'lead_in_crm',
          normalizedEmail: 'crm.lead@domain.com',
          companyName: 'CRM Exclusive Co',
          email: 'crm.lead@domain.com'
        }
      ]));

      const rawRows = [
        { 'Email': 'excel.only@domain.com' }
      ];

      const summary = await LeadMatchingService.matchDatasets(tenantA, rawRows, { email: 'Email' });

      expect(summary.excelOnlyRows).toBe(1);
      expect(summary.grabbedOnlyRows).toBe(1);
      expect(summary.grabbedOnlyLeads[0].companyName).toBe('CRM Exclusive Co');
    });
  });

  describe('4. REST API Integration & Security Controls', () => {
    test('4.1 POST /api/v1/leads/imports/parse parses uploaded content safely', async () => {
      const res = await request(app)
        .post('/api/v1/leads/imports/parse')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          fileContent: 'Company Name,Direct Email,City\nDelta Air,crew@delta.com,Atlanta',
          fileName: 'partners_q4.csv'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.headers).toEqual(['Company Name', 'Direct Email', 'City']);
      expect(res.body.totalRows).toBe(1);
    });

    test('4.2 POST /api/v1/leads/imports/match executes matching with ZERO emails sent', async () => {
      jest.spyOn(EmailSuppressionModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(ImportJobModel, 'create').mockResolvedValue({ _id: 'job_101' } as any);

      const res = await request(app)
        .post('/api/v1/leads/imports/match')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          fileName: 'outreach_targets.csv',
          rows: [
            { 'Email': 'contact@company.com', 'Company': 'Target Corp' }
          ],
          mapping: { email: 'Email', companyName: 'Company' }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Zero emails sent');
      expect(res.body.summary.totalImportedRows).toBe(1);
      expect(res.body.summary.excelOnlyRows).toBe(1);
    });

    test('4.3 POST /api/v1/leads/imports/export-report sanitizes matching report against formula injection', async () => {
      const res = await request(app)
        .post('/api/v1/leads/imports/export-report')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          records: [
            {
              rowNumber: 2,
              originalEmail: '=1+1@injected.com',
              normalizedEmail: '=1+1@injected.com',
              companyName: '+Malicious Company',
              website: 'http://safe.com',
              status: MatchResultStatus.INVALID_EMAIL,
              reason: 'Syntax error'
            }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      // Verify single quote prefixing for formula prevention
      expect(res.text).toContain("`'=1+1@injected.com".replace('`', ''));
      expect(res.text).toContain("'+Malicious Company");
    });
  });
});
