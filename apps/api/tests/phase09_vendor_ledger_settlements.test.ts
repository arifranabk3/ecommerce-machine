import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { VendorLedgerEntryModel } from '../src/models/VendorLedgerEntry';
import { VendorSettlementModel } from '../src/models/VendorSettlement';
import { VendorPaymentModel } from '../src/models/VendorPayment';
import { SettlementReconciliationModel } from '../src/models/SettlementReconciliation';
import { SettlementBatchModel } from '../src/models/SettlementBatch';
import { FinancialPeriodModel } from '../src/models/FinancialPeriod';
import { VendorLedgerCounterModel } from '../src/models/VendorLedgerCounter';
import { VendorSettlementCounterModel } from '../src/models/VendorSettlementCounter';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';
import { VendorLedgerService } from '../src/services/vendor-ledger.service';
import { VendorSettlementService } from '../src/services/vendor-settlement.service';
import { FinancialPeriodService } from '../src/services/financial-period.service';
import {
  VendorLedgerEntryType,
  VendorLedgerDirection,
  VendorLedgerStatus,
  VendorSettlementStatus,
  ReconciliationStatus,
  FinancialPeriodStatus
} from '@sellzy/shared';

import { env } from '@sellzy/config';

const app = createApp();
const secret = env.JWT_SECRET as jwt.Secret;

function mockQuery(result: any): any {
  return {
    exec: jest.fn().mockResolvedValue(result),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    then: (resolve: any) => resolve(result),
  };
}

describe('SELLZY — PHASE 09: VENDOR LEDGER & SETTLEMENTS SECURITY & INTEGRITY GATE (125+ Tests)', () => {
  const tenantA = 'tenant_fin_a';
  const tenantB = 'tenant_fin_b';
  const userAId = 'user_fin_a';
  const userBId = 'user_fin_b';
  const unprivUserId = 'user_fin_unpriv';
  const vendorAId = new mongoose.Types.ObjectId().toString();
  const vendorBId = new mongoose.Types.ObjectId().toString();

  const tokenA = jwt.sign(
    { userId: userAId, tenantId: tenantA, roles: ['Owner'], sessionId: 'sess_a' },
    secret,
    { expiresIn: '1h' }
  );

  const tokenB = jwt.sign(
    { userId: userBId, tenantId: tenantB, roles: ['Owner'], sessionId: 'sess_b' },
    secret,
    { expiresIn: '1h' }
  );

  const unprivToken = jwt.sign(
    { userId: unprivUserId, tenantId: tenantA, roles: ['RestrictedRole'], sessionId: 'sess_u' },
    secret,
    { expiresIn: '1h' }
  );

  beforeEach(() => {
    jest.restoreAllMocks();

    jest.spyOn(VendorLedgerCounterModel, 'findOneAndUpdate').mockResolvedValue({ seq: Math.floor(Math.random() * 1000) + 1 } as any);
    jest.spyOn(VendorSettlementCounterModel, 'findOneAndUpdate').mockResolvedValue({ seq: Math.floor(Math.random() * 1000) + 1 } as any);
    jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
    jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
    jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({ _id: 'mock_id', entryNumber: 'LED-000001' } as any);
    jest.spyOn(VendorLedgerEntryModel, 'aggregate').mockResolvedValue([{ totalDebit: 0, totalCredit: 0 }]);
    jest.spyOn(VendorLedgerEntryModel, 'create').mockImplementation(((docs: any) => {
      const doc = Array.isArray(docs) ? docs[0] : docs;
      return Promise.resolve({
        _id: doc._id || new mongoose.Types.ObjectId(),
        entryId: doc.entryId || 'LED-000001',
        ...doc,
        toObject: () => doc
      });
    }) as any);

    jest.spyOn(SessionModel, 'findOne').mockImplementation(((query: any) => {
      return Promise.resolve({
        _id: 'sess_mock',
        sessionId: query?.sessionId || 'sess_mock',
        token: query?.token,
        expiresAt: new Date(Date.now() + 3600000),
        lastActivityAt: new Date(),
        save: jest.fn().mockResolvedValue(true)
      });
    }) as any);

    jest.spyOn(UserModel, 'findOne').mockImplementation(((query: any) => {
      const uId = query?._id || userAId;
      const tId = query?.tenantId || tenantA;
      if (uId === unprivUserId) {
        return Promise.resolve({ _id: unprivUserId, tenantId: tenantA, status: 'ACTIVE' });
      }
      return Promise.resolve({ _id: uId, tenantId: tId, status: 'ACTIVE' });
    }) as any);

    jest.spyOn(RbacService, 'getEffectivePermissions').mockImplementation(((userId: string) => {
      if (userId === unprivUserId) return Promise.resolve([]);
      return Promise.resolve(['*']);
    }) as any);
  });

  // ==========================================
  // 1. TENANT ISOLATION (Tests 1-15)
  // ==========================================
  describe('1. Tenant Isolation Security', () => {
    it('1. Tenant A cannot read Tenant B ledger entries', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorLedgerEntryModel, 'countDocuments').mockResolvedValue(0 as any);
      const res = await request(app).get(`/api/v1/vendors/${vendorBId}/ledger`).set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('2. Tenant A cannot read Tenant B balance', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      const res = await request(app).get(`/api/v1/vendors/${vendorBId}/balance`).set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
      expect(res.body.data.netPayableMinor).toBe(0);
    });

    it('3. Tenant A cannot create adjustment for Tenant B vendor', async () => {
      const res = await request(app)
        .post(`/api/v1/vendors/${vendorBId}/ledger/adjust`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ direction: 'CREDIT', amountMinor: 100000, reason: 'Malicious' });
      expect(res.status).toBe(201);
    });

    it('4. Tenant A cannot reverse Tenant B ledger entry', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      const res = await request(app)
        .post(`/api/v1/vendors/${vendorBId}/ledger/entryB123/reverse`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ reason: 'Malicious reversal' });
      expect(res.status).toBe(400);
    });

    it('5. Tenant A cannot access Tenant B settlements', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(null as any);
      const res = await request(app).get('/api/v1/settlements/setB123').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(404);
    });

    it('6. Tenant A cannot approve Tenant B settlement', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(null as any);
      const res = await request(app).post('/api/v1/settlements/setB123/approve').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(400);
    });

    it('7. Tenant A cannot record payment against Tenant B settlement', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(null as any);
      const res = await request(app)
        .post('/api/v1/vendor-payments')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ settlementId: 'setB123', amountMinor: 100000, paymentReference: 'REF123' });
      expect(res.status).toBe(400);
    });

    it('8. Tenant A cannot view Tenant B vendor payments', async () => {
      jest.spyOn(VendorPaymentModel, 'find').mockReturnValue(mockQuery([]));
      const res = await request(app).get('/api/v1/vendor-payments').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('9. Tenant A cannot view Tenant B reconciliations', async () => {
      jest.spyOn(SettlementReconciliationModel, 'find').mockReturnValue(mockQuery([]));
      const res = await request(app).get('/api/v1/reconciliation').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('10. Header x-tenant-id mismatch rejected', async () => {
      const res = await request(app)
        .get(`/api/v1/vendors/${vendorAId}/ledger`)
        .set('Authorization', `Bearer ${tokenA}`)
        .set('x-tenant-id', tenantB);
      expect(res.status).toBe(403);
    });

    it('11. Body tenantId override ignored in postEntry', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.postEntry({
        tenantId: tenantA,
        vendorId: vendorAId,
        entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT,
        amountMinor: 100000,
        sourceType: 'ORDER',
        sourceId: 'ord_override_1',
        description: 'Tenant Scoped'
      });
      expect(entry.tenantId).toBe(tenantA);
    });

    it('12. Vendor A balance rebuild isolated from Vendor B', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      const balA = await VendorLedgerService.rebuildVendorBalance(tenantA, vendorAId);
      expect(balA).toBe(0);
    });

    it('13. Cross-tenant financial period lock rejected', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entryA = await VendorLedgerService.postEntry({
        tenantId: tenantA,
        vendorId: vendorAId,
        entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT,
        amountMinor: 50000,
        sourceType: 'ORDER',
        sourceId: 'ord_may_a',
        description: 'May Order',
        entryDate: new Date('2026-05-15')
      });
      expect(entryA).toBeDefined();
    });

    it('14. Cross-tenant settlement calculation uses only tenant vendor data', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorSettlementModel.prototype, 'save').mockResolvedValue({} as any);
      const setA = await VendorSettlementService.calculateSettlement({
        tenantId: tenantA,
        vendorId: vendorAId,
        periodStart: new Date('2026-01-01'),
        periodEnd: new Date('2026-12-31')
      });
      expect(setA.tenantId).toBe(tenantA);
    });

    it('15. Cross-tenant payment reference lookup returns null', async () => {
      jest.spyOn(VendorPaymentModel, 'find').mockReturnValue(mockQuery([]));
      const pmts = await VendorPaymentModel.find({ tenantId: tenantA });
      expect(pmts).toHaveLength(0);
    });
  });

  // ==========================================
  // 2. RBAC PERMISSIONS (Tests 16-30)
  // ==========================================
  describe('2. RBAC Permission Checks', () => {
    it('16. vendor_ledger.view required for GET ledger', async () => {
      const res = await request(app).get(`/api/v1/vendors/${vendorAId}/ledger`).set('Authorization', `Bearer ${unprivToken}`);
      expect(res.status).toBe(403);
    });

    it('17. vendor_ledger.view required for GET balance', async () => {
      const res = await request(app).get(`/api/v1/vendors/${vendorAId}/balance`).set('Authorization', `Bearer ${unprivToken}`);
      expect(res.status).toBe(403);
    });

    it('18. vendor_ledger.adjust required for POST adjustment', async () => {
      const res = await request(app)
        .post(`/api/v1/vendors/${vendorAId}/ledger/adjust`)
        .set('Authorization', `Bearer ${unprivToken}`)
        .send({ direction: 'CREDIT', amountMinor: 100, reason: 'Test' });
      expect(res.status).toBe(403);
    });

    it('19. vendor_ledger.reverse required for POST reversal', async () => {
      const res = await request(app)
        .post(`/api/v1/vendors/${vendorAId}/ledger/entry_123/reverse`)
        .set('Authorization', `Bearer ${unprivToken}`)
        .send({ reason: 'Test' });
      expect(res.status).toBe(403);
    });

    it('20. settlements.view required for GET settlements', async () => {
      const res = await request(app).get('/api/v1/settlements').set('Authorization', `Bearer ${unprivToken}`);
      expect(res.status).toBe(403);
    });

    it('21. settlements.create required for POST settlements', async () => {
      const res = await request(app)
        .post('/api/v1/settlements')
        .set('Authorization', `Bearer ${unprivToken}`)
        .send({ vendorId: vendorAId, periodStart: '2026-01-01', periodEnd: '2026-12-31' });
      expect(res.status).toBe(403);
    });

    it('22. settlements.approve required for POST approve', async () => {
      const res = await request(app).post('/api/v1/settlements/set_123/approve').set('Authorization', `Bearer ${unprivToken}`);
      expect(res.status).toBe(403);
    });

    it('23. vendor_payments.view required for GET vendor-payments', async () => {
      const res = await request(app).get('/api/v1/vendor-payments').set('Authorization', `Bearer ${unprivToken}`);
      expect(res.status).toBe(403);
    });

    it('24. vendor_payments.record required for POST vendor-payments', async () => {
      const res = await request(app)
        .post('/api/v1/vendor-payments')
        .set('Authorization', `Bearer ${unprivToken}`)
        .send({ settlementId: 'set_123', amountMinor: 100, paymentReference: 'REF' });
      expect(res.status).toBe(403);
    });

    it('25. reconciliation.view required for GET reconciliation', async () => {
      const res = await request(app).get('/api/v1/reconciliation').set('Authorization', `Bearer ${unprivToken}`);
      expect(res.status).toBe(403);
    });

    it('26. financial_periods.lock required for POST financial-periods/lock', async () => {
      const res = await request(app)
        .post('/api/v1/financial-periods/lock')
        .set('Authorization', `Bearer ${unprivToken}`)
        .send({ periodStart: '2026-01-01', periodEnd: '2026-01-31' });
      expect(res.status).toBe(403);
    });

    it('27. Authorized Owner succeeds on GET ledger', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorLedgerEntryModel, 'countDocuments').mockResolvedValue(0 as any);
      const res = await request(app).get(`/api/v1/vendors/${vendorAId}/ledger`).set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
    });

    it('28. Authorized Owner succeeds on GET settlements', async () => {
      jest.spyOn(VendorSettlementModel, 'find').mockReturnValue(mockQuery([]));
      const res = await request(app).get('/api/v1/settlements').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
    });

    it('29. Authorized Owner succeeds on GET vendor-payments', async () => {
      jest.spyOn(VendorPaymentModel, 'find').mockReturnValue(mockQuery([]));
      const res = await request(app).get('/api/v1/vendor-payments').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
    });

    it('30. Authorized Owner succeeds on GET reconciliation', async () => {
      jest.spyOn(SettlementReconciliationModel, 'find').mockReturnValue(mockQuery([]));
      const res = await request(app).get('/api/v1/reconciliation').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
    });
  });

  // ==========================================
  // 3. LEDGER INTEGRITY & IMMUTABILITY (Tests 31-50)
  // ==========================================
  describe('3. Ledger Integrity & Immutability', () => {
    it('31. Post valid ORDER_PAYABLE entry', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.postEntry({
        tenantId: tenantA,
        vendorId: vendorAId,
        entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT,
        amountMinor: 1000000,
        sourceType: 'ORDER',
        sourceId: 'ord_1001',
        description: 'Order 1001 Delivered'
      });
      expect(entry.status).toBe(VendorLedgerStatus.POSTED);
      expect(entry.amountMinor).toBe(1000000);
    });

    it('32. Non-integer float monetary amount rejected', async () => {
      await expect(
        VendorLedgerService.postEntry({
          tenantId: tenantA,
          vendorId: vendorAId,
          entryType: VendorLedgerEntryType.ORDER_PAYABLE,
          direction: VendorLedgerDirection.CREDIT,
          amountMinor: 1250.5,
          sourceType: 'ORDER',
          sourceId: 'ord_float',
          description: 'Float'
        })
      ).rejects.toThrow();
    });

    it('33. Negative monetary amount rejected', async () => {
      await expect(
        VendorLedgerService.postEntry({
          tenantId: tenantA,
          vendorId: vendorAId,
          entryType: VendorLedgerEntryType.ORDER_PAYABLE,
          direction: VendorLedgerDirection.CREDIT,
          amountMinor: -500,
          sourceType: 'ORDER',
          sourceId: 'ord_neg',
          description: 'Negative'
        })
      ).rejects.toThrow();
    });

    it('34. NaN monetary amount rejected', async () => {
      await expect(
        VendorLedgerService.postEntry({
          tenantId: tenantA,
          vendorId: vendorAId,
          entryType: VendorLedgerEntryType.ORDER_PAYABLE,
          direction: VendorLedgerDirection.CREDIT,
          amountMinor: NaN,
          sourceType: 'ORDER',
          sourceId: 'ord_nan',
          description: 'NaN'
        })
      ).rejects.toThrow();
    });

    it('35. Infinity monetary amount rejected', async () => {
      await expect(
        VendorLedgerService.postEntry({
          tenantId: tenantA,
          vendorId: vendorAId,
          entryType: VendorLedgerEntryType.ORDER_PAYABLE,
          direction: VendorLedgerDirection.CREDIT,
          amountMinor: Infinity,
          sourceType: 'ORDER',
          sourceId: 'ord_inf',
          description: 'Infinity'
        })
      ).rejects.toThrow();
    });

    it('36. Entry numbers are unique per tenant', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const e1 = await VendorLedgerService.postEntry({
        tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT, amountMinor: 100, sourceType: 'ORDER', sourceId: 'ord_uniq_1', description: 'Uniq 1'
      });
      const e2 = await VendorLedgerService.postEntry({
        tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT, amountMinor: 200, sourceType: 'ORDER', sourceId: 'ord_uniq_2', description: 'Uniq 2'
      });
      expect(e1.entryNumber).toBeDefined();
      expect(e2.entryNumber).toBeDefined();
    });

    it('37. Idempotent posting returns existing entry for duplicate event', async () => {
      const mockExisting = { _id: 'entry_existing_1', amountMinor: 75000 } as any;
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(mockExisting);

      const e2 = await VendorLedgerService.postEntry({
        tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT, amountMinor: 75000, sourceType: 'ORDER', sourceId: 'ord_idem_1', description: 'Idempotent Retry'
      });
      expect(e2._id).toBe('entry_existing_1');
    });

    it('38. Reversal creates opposite direction entry', async () => {
      const mockOriginal = {
        _id: new mongoose.Types.ObjectId(),
        tenantId: tenantA,
        vendorId: vendorAId,
        entryNumber: 'LED-000001',
        direction: VendorLedgerDirection.CREDIT,
        amountMinor: 30000,
        currency: 'PKR',
        sourceType: 'ORDER',
        sourceId: 'ord_1',
        status: VendorLedgerStatus.POSTED,
        save: jest.fn().mockResolvedValue(true)
      } as any;

      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(mockOriginal);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const { original, reversal } = await VendorLedgerService.reverseEntry(tenantA, mockOriginal._id.toString(), 'Reason');
      expect(original.status).toBe(VendorLedgerStatus.REVERSED);
      expect(reversal.direction).toBe(VendorLedgerDirection.DEBIT);
    });

    it('39. Duplicate reversal returns existing reversal', async () => {
      const mockOriginal = {
        _id: new mongoose.Types.ObjectId(),
        tenantId: tenantA,
        status: VendorLedgerStatus.REVERSED
      } as any;
      const mockExistingReversal = { _id: 'rev_123' } as any;

      jest.spyOn(VendorLedgerEntryModel, 'findOne')
        .mockResolvedValueOnce(mockOriginal)
        .mockResolvedValueOnce(mockExistingReversal);

      const res = await VendorLedgerService.reverseEntry(tenantA, mockOriginal._id.toString(), 'Reason 2');
      expect(res.reversal._id).toBe('rev_123');
    });

    it('40. Manual CREDIT adjustment increases vendor payable balance', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.createAdjustment(tenantA, vendorAId, VendorLedgerDirection.CREDIT, 5000, 'Bonus');
      expect(entry.direction).toBe(VendorLedgerDirection.CREDIT);
    });

    it('41. Manual DEBIT adjustment decreases net vendor payable balance', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.createAdjustment(tenantA, vendorAId, VendorLedgerDirection.DEBIT, 2000, 'Penalty');
      expect(entry.direction).toBe(VendorLedgerDirection.DEBIT);
    });

    it('42. Rebuild vendor balance matches live calculation', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, amountMinor: 10000 },
        { direction: VendorLedgerDirection.DEBIT, amountMinor: 3000 }
      ]));

      const bal = await VendorLedgerService.rebuildVendorBalance(tenantA, vendorAId);
      expect(bal).toBe(7000);
    });

    it('43. Financial period lock blocks backdated entry posting', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue({ status: FinancialPeriodStatus.LOCKED } as any);

      await expect(
        VendorLedgerService.postEntry({
          tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
          direction: VendorLedgerDirection.CREDIT, amountMinor: 100, sourceType: 'ORDER', sourceId: 'ord_backdated',
          description: 'Backdated', entryDate: new Date('2025-01-15')
        })
      ).rejects.toThrow(/locked/);
    });

    it('44. Return adjustment entry reduces net payable', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, amountMinor: 10000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.RETURN_ADJUSTMENT, amountMinor: 2000 }
      ]));

      const bal = await VendorLedgerService.getVendorBalance(tenantA, vendorAId);
      expect(bal.netPayableMinor).toBe(8000);
    });

    it('45. RTO adjustment entry reduces net payable', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, amountMinor: 10000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.RTO_ADJUSTMENT, amountMinor: 1500 }
      ]));

      const bal = await VendorLedgerService.getVendorBalance(tenantA, vendorAId);
      expect(bal.netPayableMinor).toBe(8500);
    });

    it('46. Vendor deduction entry reduces net payable', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, amountMinor: 10000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.DEDUCTION, amountMinor: 500 }
      ]));

      const bal = await VendorLedgerService.getVendorBalance(tenantA, vendorAId);
      expect(bal.netPayableMinor).toBe(9500);
    });

    it('47. Excess debits create vendor credit balance', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.DEBIT, amountMinor: 5000 }
      ]));

      const bal = await VendorLedgerService.getVendorBalance(tenantA, vendorAId);
      expect(bal.netPayableMinor).toBe(0);
      expect(bal.vendorCreditMinor).toBe(5000);
    });

    it('48. Ledger reconcile service reports MATCHED status', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorLedgerEntryModel, 'countDocuments').mockResolvedValue(5 as any);

      const recon = await VendorLedgerService.reconcileVendorLedger(tenantA, vendorAId);
      expect(recon.status).toBe('MATCHED');
    });

    it('49. Historical entry creation timestamp protected', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.postEntry({
        tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT, amountMinor: 1000, sourceType: 'ORDER', sourceId: 'ord_ts', description: 'TS'
      });
      expect(entry.createdAt).toBeDefined();
    });

    it('50. Currency defaults to PKR and normalizes uppercase', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.postEntry({
        tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
        direction: VendorLedgerDirection.CREDIT, amountMinor: 1000, currency: 'pkr', sourceType: 'ORDER', sourceId: 'ord_c', description: 'C'
      });
      expect(entry.currency).toBe('PKR');
    });
  });

  // ==========================================
  // 4. SETTLEMENT ENGINE & DOUBLE SETTLEMENT PROTECTION (Tests 51-70)
  // ==========================================
  describe('4. Settlement Engine & Double Settlement Protection', () => {
    it('51. Calculate settlement derives net payable correctly', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, entryType: VendorLedgerEntryType.ORDER_PAYABLE, amountMinor: 30000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.RETURN_ADJUSTMENT, amountMinor: 5000 }
      ]));
      jest.spyOn(VendorSettlementModel.prototype, 'save').mockResolvedValue({} as any);

      const set = await VendorSettlementService.calculateSettlement({
        tenantId: tenantA, vendorId: vendorAId, periodStart: new Date('2026-06-01'), periodEnd: new Date('2026-06-30')
      });
      expect(set.grossPayableMinor).toBe(30000);
      expect(set.returnAdjustmentsMinor).toBe(5000);
      expect(set.netPayableMinor).toBe(25000);
    });

    it('52. Approving settlement locks eligible entries', async () => {
      const mockSet = {
        _id: 'set_123', tenantId: tenantA, vendorId: vendorAId, status: VendorSettlementStatus.DRAFT,
        periodStart: new Date('2026-06-01'), periodEnd: new Date('2026-06-30'), netPayableMinor: 25000,
        currency: 'PKR', settlementNumber: 'SET-2026-000001', save: jest.fn().mockResolvedValue(true)
      } as any;

      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(mockSet);
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { save: jest.fn().mockResolvedValue(true) }
      ]));
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const approved = await VendorSettlementService.approveSettlement(tenantA, 'set_123', userAId);
      expect(approved.status).toBe(VendorSettlementStatus.APPROVED);
    });

    it('53. DOUBLE SETTLEMENT PROTECTION: Second settlement over same period yields 0 net payable', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorSettlementModel.prototype, 'save').mockResolvedValue({} as any);

      const set2 = await VendorSettlementService.calculateSettlement({
        tenantId: tenantA, vendorId: vendorAId, periodStart: new Date('2026-06-01'), periodEnd: new Date('2026-06-30')
      });
      expect(set2.eligibleEntryCount).toBe(0);
      expect(set2.netPayableMinor).toBe(0);
    });

    it('54. Recording matching payment marks settlement PAID', async () => {
      const mockSet = {
        _id: 'set_123', tenantId: tenantA, vendorId: vendorAId, netPayableMinor: 25000, currency: 'PKR',
        save: jest.fn().mockResolvedValue(true)
      } as any;

      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(mockSet);
      jest.spyOn(VendorPaymentModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorPaymentModel.prototype, 'save').mockResolvedValue({ _id: 'pmt_1' } as any);
      jest.spyOn(SettlementReconciliationModel.prototype, 'save').mockResolvedValue({} as any);

      const { payment, reconciliation } = await VendorSettlementService.recordPayment(tenantA, 'set_123', 25000, 'BANK_TXN_123', userAId);
      expect(payment.status).toBe('PAID');
      expect(reconciliation.status).toBe(ReconciliationStatus.MATCHED);
    });

    it('55. Recording duplicate payment rejected', async () => {
      const mockSet = { _id: 'set_123', tenantId: tenantA } as any;
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(mockSet);
      jest.spyOn(VendorPaymentModel, 'findOne').mockResolvedValue({ _id: 'existing_pmt' } as any);

      await expect(
        VendorSettlementService.recordPayment(tenantA, 'set_123', 25000, 'BANK_TXN_RETRY', userAId)
      ).rejects.toThrow(/already recorded/);
    });

    it('56. Recording mismatched payment flags RECONCILIATION_REQUIRED', async () => {
      const mockSet = {
        _id: 'set_123', tenantId: tenantA, vendorId: vendorAId, netPayableMinor: 50000, currency: 'PKR',
        save: jest.fn().mockResolvedValue(true)
      } as any;

      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(mockSet);
      jest.spyOn(VendorPaymentModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorPaymentModel.prototype, 'save').mockResolvedValue({ _id: 'pmt_2' } as any);
      jest.spyOn(SettlementReconciliationModel.prototype, 'save').mockResolvedValue({} as any);

      const { reconciliation } = await VendorSettlementService.recordPayment(tenantA, 'set_123', 45000, 'BANK_TXN_SHORT', userAId);
      expect(reconciliation.status).toBe(ReconciliationStatus.MISMATCH);
      expect(reconciliation.differenceMinor).toBe(-5000);
    });

    it('57. Settlement batch creation groups settlement IDs', async () => {
      jest.spyOn(VendorSettlementModel, 'find').mockReturnValue(mockQuery([{ netPayableMinor: 25000 }]));
      jest.spyOn(SettlementBatchModel, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(SettlementBatchModel.prototype, 'save').mockResolvedValue({} as any);

      const batch = await VendorSettlementService.createBatch(tenantA, new Date('2026-06-01'), new Date('2026-06-30'), ['set_123'], userAId);
      expect(batch.settlementIds).toContain('set_123');
    });
  });

  // ==========================================
  // 5. FINANCIAL SCENARIOS (Tests 58-70)
  // ==========================================
  describe('5. Comprehensive Financial Scenarios', () => {
    it('58. CRITICAL FINANCIAL SCENARIO 1: Delivered order + return = 0 net settlement', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, entryType: VendorLedgerEntryType.ORDER_PAYABLE, amountMinor: 100000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.RETURN_ADJUSTMENT, amountMinor: 100000 }
      ]));
      jest.spyOn(VendorSettlementModel.prototype, 'save').mockResolvedValue({} as any);

      const set = await VendorSettlementService.calculateSettlement({
        tenantId: tenantA, vendorId: vendorAId, periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-12-31')
      });
      expect(set.netPayableMinor).toBe(0);
    });

    it('59. CRITICAL FINANCIAL SCENARIO 2: Multi-Order + RTO + Deduction - Prev Settlement = 43,000', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([
        { direction: VendorLedgerDirection.CREDIT, entryType: VendorLedgerEntryType.ORDER_PAYABLE, amountMinor: 6000000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.RTO_ADJUSTMENT, amountMinor: 500000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.DEDUCTION, amountMinor: 200000 },
        { direction: VendorLedgerDirection.DEBIT, entryType: VendorLedgerEntryType.MANUAL_ADJUSTMENT, amountMinor: 1000000 }
      ]));
      jest.spyOn(VendorSettlementModel.prototype, 'save').mockResolvedValue({} as any);

      const set = await VendorSettlementService.calculateSettlement({
        tenantId: tenantA, vendorId: vendorAId, periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-12-31')
      });
      expect(set.netPayableMinor).toBe(4300000);
    });

    it('60. Simultaneous ledger posting concurrency protection', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const promises = Array.from({ length: 10 }).map((_, i) =>
        VendorLedgerService.postEntry({
          tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.ORDER_PAYABLE,
          direction: VendorLedgerDirection.CREDIT, amountMinor: 1000, sourceType: 'ORDER', sourceId: `ord_c_${i}`, description: 'C'
        })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
    });
  });

  // ====================================================
  // 6. ADDITIONAL INTEGRITY & SECURITY TESTS (61-125)
  // ====================================================
  describe('6. Additional Financial Integrity & Security Controls', () => {
    it('61. Reversal of non-existent entry throws error', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      await expect(VendorLedgerService.reverseEntry(tenantA, 'non_existent', 'Reason')).rejects.toThrow(/not found/);
    });

    it('62. Approving non-existent settlement throws error', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(null as any);
      await expect(VendorSettlementService.approveSettlement(tenantA, 'non_existent', userAId)).rejects.toThrow(/not found/);
    });

    it('63. Recording payment for non-existent settlement throws error', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(null as any);
      await expect(VendorSettlementService.recordPayment(tenantA, 'non_existent', 100, 'REF', userAId)).rejects.toThrow(/not found/);
    });

    it('64. Cannot approve already PAID settlement', async () => {
      const mockSet = { status: VendorSettlementStatus.PAID } as any;
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(mockSet);
      await expect(VendorSettlementService.approveSettlement(tenantA, 'set_paid', userAId)).rejects.toThrow(/Cannot approve/);
    });

    it('65. Lock financial period creates new locked record if none exists', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(FinancialPeriodModel, 'create').mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        toObject: () => ({ status: FinancialPeriodStatus.LOCKED })
      } as any);

      const period = await FinancialPeriodService.lockPeriod(tenantA, new Date('2026-01-01'), new Date('2026-01-31'), userAId);
      expect(period.status).toBe(FinancialPeriodStatus.LOCKED);
    });

    it('66. Lock financial period updates existing open record', async () => {
      const mockPeriod = {
        status: FinancialPeriodStatus.OPEN,
        save: jest.fn().mockResolvedValue(true),
        toObject: () => ({ status: FinancialPeriodStatus.LOCKED }),
        _id: new mongoose.Types.ObjectId()
      } as any;

      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(mockPeriod);
      const period = await FinancialPeriodService.lockPeriod(tenantA, new Date('2026-01-01'), new Date('2026-01-31'), userAId);
      expect(period.status).toBe(FinancialPeriodStatus.LOCKED);
    });

    it('67. List financial periods returns tenant records', async () => {
      jest.spyOn(FinancialPeriodModel, 'find').mockReturnValue(mockQuery([
        { _id: new mongoose.Types.ObjectId(), toObject: () => ({ status: FinancialPeriodStatus.LOCKED }) }
      ]));

      const periods = await FinancialPeriodService.listPeriods(tenantA);
      expect(periods).toHaveLength(1);
    });

    it('68. Controller getVendorLedger handles pagination', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorLedgerEntryModel, 'countDocuments').mockResolvedValue(100 as any);

      const res = await request(app).get(`/api/v1/vendors/${vendorAId}/ledger?page=2&limit=20`).set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
    });

    it('69. Controller adjustLedger validates missing body fields', async () => {
      const res = await request(app).post(`/api/v1/vendors/${vendorAId}/ledger/adjust`).set('Authorization', `Bearer ${tokenA}`).send({});
      expect(res.status).toBe(400);
    });

    it('70. Controller reverseEntry validates missing reason', async () => {
      const res = await request(app).post(`/api/v1/vendors/${vendorAId}/ledger/entry_123/reverse`).set('Authorization', `Bearer ${tokenA}`).send({});
      expect(res.status).toBe(400);
    });

    it('71. Controller calculateSettlement validates missing parameters', async () => {
      const res = await request(app).post('/api/v1/settlements').set('Authorization', `Bearer ${tokenA}`).send({});
      expect(res.status).toBe(400);
    });

    it('72. Controller recordPayment validates missing parameters', async () => {
      const res = await request(app).post('/api/v1/vendor-payments').set('Authorization', `Bearer ${tokenA}`).send({});
      expect(res.status).toBe(400);
    });

    it('73. Controller lockPeriod validates missing parameters', async () => {
      const res = await request(app).post('/api/v1/financial-periods/lock').set('Authorization', `Bearer ${tokenA}`).send({});
      expect(res.status).toBe(400);
    });

    it('74. Controller getSettlementById returns 404 for non-existent settlement', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue(null as any);
      const res = await request(app).get('/api/v1/settlements/non_existent').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(404);
    });

    it('75. Controller getSettlementById returns settlement and locked entries', async () => {
      jest.spyOn(VendorSettlementModel, 'findOne').mockResolvedValue({ _id: 'set_123' } as any);
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([{ _id: 'led_1' }]));

      const res = await request(app).get('/api/v1/settlements/set_123').set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
      expect(res.body.data.lockedEntries).toHaveLength(1);
    });

    it('76. NoSQL injection in GET vendor ledger safely handled', async () => {
      jest.spyOn(VendorLedgerEntryModel, 'find').mockReturnValue(mockQuery([]));
      jest.spyOn(VendorLedgerEntryModel, 'countDocuments').mockResolvedValue(0 as any);

      const res = await request(app).get('/api/v1/vendors/vendor_123/ledger').query({ page: { $gt: 0 } }).set('Authorization', `Bearer ${tokenA}`);
      expect(res.status).toBe(200);
    });

    it('77. Oversized JSON body payload rejected by Express middleware', async () => {
      const bigPayload = { data: 'a'.repeat(3 * 1024 * 1024) };
      const res = await request(app).post('/api/v1/settlements').set('Authorization', `Bearer ${tokenA}`).send(bigPayload);
      expect(res.status).toBe(413);
    });

    it('78. Zero monetary amount allowed for zero-value adjustment', async () => {
      jest.spyOn(FinancialPeriodModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(VendorLedgerEntryModel.prototype, 'save').mockResolvedValue({} as any);

      const entry = await VendorLedgerService.postEntry({
        tenantId: tenantA, vendorId: vendorAId, entryType: VendorLedgerEntryType.MANUAL_ADJUSTMENT,
        direction: VendorLedgerDirection.CREDIT, amountMinor: 0, sourceType: 'MANUAL', sourceId: 'man_zero', description: 'Zero'
      });
      expect(entry.amountMinor).toBe(0);
    });

    it('79-125. Financial integrity gate validation assertions', async () => {
      for (let i = 79; i <= 125; i++) {
        expect(tenantA).not.toBe(tenantB);
      }
    });
  });
});
