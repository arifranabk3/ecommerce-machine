import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

// ==========================================
// PUBLIC WEBHOOK ENDPOINT
// ==========================================
router.post('/webhooks/:provider', PaymentController.handleWebhook);

// All subsequent routes require authentication
router.use(authenticateToken);

// ==========================================
// PAYMENT ROUTES
// ==========================================
router.get('/', requirePermission('payments.view'), PaymentController.getPayments);
router.post('/', requirePermission('payments.create'), PaymentController.initiatePayment);

router.get('/cod', requirePermission('cod.view'), PaymentController.getCODOverview);
router.post('/cod/:id/collect', requirePermission('cod.manage'), PaymentController.collectCOD);

router.get('/reconciliation', requirePermission('payment_reconciliation.view'), PaymentController.getReconciliations);
router.post('/reconciliation/:id/resolve', requirePermission('payment_reconciliation.manage'), PaymentController.resolveReconciliation);

router.get('/:id', requirePermission('payments.view'), PaymentController.getPaymentById);
router.post('/:id/capture', requirePermission('payments.capture'), PaymentController.capturePayment);
router.post('/:id/cancel', requirePermission('payments.cancel'), PaymentController.cancelPayment);

// ==========================================
// REFUND ROUTES (Mounted at /api/v1/refunds)
// ==========================================
export const refundRouter = Router();
refundRouter.use(authenticateToken);

refundRouter.get('/', requirePermission('refunds.view'), PaymentController.getRefunds);
refundRouter.post('/', requirePermission('refunds.create'), PaymentController.requestRefund);
refundRouter.post('/:id/process', requirePermission('refunds.process'), PaymentController.processRefund);

// ==========================================
// FINANCE ROUTES (Mounted at /api/v1/finance)
// ==========================================
export const financeRouter = Router();
financeRouter.use(authenticateToken);

financeRouter.get('/', requirePermission('finance.view'), PaymentController.getFinanceSummary);
financeRouter.get('/transactions', requirePermission('finance.view'), PaymentController.getFinancialTransactions);

export default router;
