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
import { CANONICAL_LEAD_HEADERS, MatchResultStatus, LeadVerificationStatus } from '@sellzy/shared';
import { SpreadsheetParserService } from '../src/services/SpreadsheetParserService';

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

describe('SELLZY — EMAIL GRABBER & SENDER EXACT CANONICAL SCHEMA COMPATIBILITY ROUND-TRIP TEST SUITE', () => {
  const tenantA = 'tenant_canonical_01';
  const userAId = 'usr_canonical_01';

  let tokenAdminA: string;

  beforeEach(() => {
    jest.clearAllMocks();

    tokenAdminA = jwt.sign(
      {
        userId: userAId,
        tenantId: tenantA,
        role: 'ADMIN',
        roles: ['ADMIN'],
        sessionId: 'sess_canonical_1'
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

  describe('1. Shared Canonical Schema Definitions', () => {
    test('1.1 Canonical schema contains the exact 11 required headers in the exact order', () => {
      expect(CANONICAL_LEAD_HEADERS).toEqual([
        'Email',
        'First Name',
        'Last Name',
        'Company',
        'Website',
        'Industry',
        'Country',
        'State',
        'City',
        'Source URL',
        'Verification Status'
      ]);
    });

    test('1.2 SpreadsheetParserService accurately validates headers against canonical schema', () => {
      const validHeaders = [...CANONICAL_LEAD_HEADERS];
      const resValid = SpreadsheetParserService.validateHeadersAgainstCanonical(validHeaders);
      expect(resValid.isValid).toBe(true);
      expect(resValid.missingHeaders).toHaveLength(0);
      expect(resValid.orderMismatch).toBe(false);

      // Out of order headers
      const outOfOrder = [...CANONICAL_LEAD_HEADERS].reverse();
      const resOrder = SpreadsheetParserService.validateHeadersAgainstCanonical(outOfOrder);
      expect(resOrder.isValid).toBe(false);
      expect(resOrder.orderMismatch).toBe(true);

      // Missing header
      const missing = CANONICAL_LEAD_HEADERS.slice(1);
      const resMissing = SpreadsheetParserService.validateHeadersAgainstCanonical(missing);
      expect(resMissing.isValid).toBe(false);
      expect(resMissing.missingHeaders).toContain('Email');
    });
  });

  describe('2. Full Round-Trip Compatibility: Email Grabber Export → Email Sender Import', () => {
    const mockLeadInCrm = {
      _id: 'ld_grabbed_100',
      tenantId: tenantA,
      email: 'alex.ops@acmelogistics.com',
      normalizedEmail: 'alex.ops@acmelogistics.com',
      companyName: 'Acme Logistics LLC',
      website: 'https://acmelogistics.example.com',
      industry: 'Logistics & Freight',
      country: 'US',
      state: 'IL',
      city: 'Chicago',
      source: 'DIRECTORY_SEARCH',
      sourceUrl: 'https://illinois-registry.example.gov/acme',
      verificationStatus: LeadVerificationStatus.DELIVERABLE,
      collectedAt: new Date()
    };

    let exportedCsvString: string;

    test('2.1 Grabber Export: GET /api/v1/leads/export-csv produces canonical headers in exact order', async () => {
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([mockLeadInCrm]));

      const res = await request(app)
        .get('/api/v1/leads/export-csv')
        .set('Authorization', `Bearer ${tokenAdminA}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');

      exportedCsvString = res.text;
      const firstLine = exportedCsvString.split(/\r?\n/)[0];
      expect(firstLine).toBe(CANONICAL_LEAD_HEADERS.join(','));

      // Second line contains values mapped exactly to canonical order
      const secondLine = exportedCsvString.split(/\r?\n/)[1];
      expect(secondLine).toContain('"alex.ops@acmelogistics.com"');
      expect(secondLine).toContain('"Acme Logistics LLC"');
      expect(secondLine).toContain('"deliverable"');
    });

    test('2.2 Sender Parse: Uploading the exact Grabber export verifies canonical schema without manual mapping', async () => {
      const res = await request(app)
        .post('/api/v1/leads/imports/parse')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          fileContent: exportedCsvString,
          fileName: 'grabber_export.csv'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isCanonical).toBe(true);
      expect(res.body.schemaValidation.isValid).toBe(true);
      expect(res.body.headers).toEqual([...CANONICAL_LEAD_HEADERS]);
      expect(res.body.totalRows).toBe(1);
    });

    test('2.3 Sender Match: Direct ingestion of Grabber export without manual mapping successfully computes exact_match', async () => {
      jest.spyOn(EmailSuppressionModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(LeadModel, 'find').mockReturnValue(mockQuery([mockLeadInCrm]));
      jest.spyOn(ImportJobModel, 'create').mockResolvedValue({ _id: 'job_auto_mapped' } as any);

      // Parse the CSV rows
      const parsed = SpreadsheetParserService.parseCsv(exportedCsvString);

      // Submit matching without manual mapping (auto-detect canonical)
      const res = await request(app)
        .post('/api/v1/leads/imports/match')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          fileName: 'grabber_export.csv',
          rows: parsed.rows
          // mapping omitted to test zero-friction auto-mapping
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.summary.exactMatchRows).toBe(1);
      expect(res.body.summary.records[0].status).toBe(MatchResultStatus.EXACT_MATCH);
      expect(res.body.summary.records[0].matchedLeadId).toBe('ld_grabbed_100');
    });
  });

  describe('3. Validation Errors & Actionable Correction Options', () => {
    test('3.1 Rejects files missing required Email column with actionable schema validation details', async () => {
      const nonCompliantCsv = `FirstName,LastName,Company\nJohn,Doe,Acme Inc`;

      const res = await request(app)
        .post('/api/v1/leads/imports/parse')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          fileContent: nonCompliantCsv,
          fileName: 'non_compliant.csv'
        });

      expect(res.status).toBe(200);
      expect(res.body.isCanonical).toBe(false);
      expect(res.body.schemaValidation.isValid).toBe(false);
      expect(res.body.schemaValidation.missingHeaders).toContain('Email');
      expect(res.body.schemaValidation.extraHeaders).toContain('FirstName');
    });

    test('3.2 Rejects empty rows and provides validation without triggering any email sends', async () => {
      const res = await request(app)
        .post('/api/v1/leads/imports/match')
        .set('Authorization', `Bearer ${tokenAdminA}`)
        .send({
          fileName: 'empty.csv',
          rows: []
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('rows array is required');
    });
  });
});

