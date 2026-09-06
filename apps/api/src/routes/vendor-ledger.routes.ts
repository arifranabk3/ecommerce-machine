import { Router } from 'express';
import {
  VendorLedgerController,
  VendorSettlementController
} from '../controllers/vendor-ledger.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Vendor Ledger & Balance Routes
router.get(
  '/:id/ledger',
  requirePermission('vendor_ledger.view'),
  VendorLedgerController.getVendorLedger
);

router.get(
  '/:id/balance',
  requirePermission('vendor_ledger.view'),
  VendorLedgerController.getVendorBalance
);

router.post(
  '/:id/ledger/adjust',
  requirePermission('vendor_ledger.adjust'),
  VendorLedgerController.adjustLedger
);

router.post(
  '/:id/ledger/:entryId/reverse',
  requirePermission('vendor_ledger.reverse'),
  VendorLedgerController.reverseEntry
);

// Settlement Routes
router.get(
  '/settlements',
  requirePermission('settlements.view'),
  VendorSettlementController.getSettlements
);

router.post(
  '/settlements',
  requirePermission('settlements.create'),
  VendorSettlementController.calculateSettlement
);

router.get(
  '/settlements/:id',
  requirePermission('settlements.view'),
  VendorSettlementController.getSettlementById
);

router.post(
  '/settlements/:id/approve',
  requirePermission('settlements.approve'),
  VendorSettlementController.approveSettlement
);

// Payment & Reconciliation Routes
router.get(
  '/vendor-payments',
  requirePermission('vendor_payments.view'),
  VendorSettlementController.getPayments
);

router.post(
  '/vendor-payments',
  requirePermission('vendor_payments.record'),
  VendorSettlementController.recordPayment
);

router.get(
  '/reconciliation',
  requirePermission('reconciliation.view'),
  VendorSettlementController.getReconciliations
);

// Financial Period Locking Routes
router.post(
  '/financial-periods/lock',
  requirePermission('financial_periods.lock'),
  VendorSettlementController.lockPeriod
);

export default router;
