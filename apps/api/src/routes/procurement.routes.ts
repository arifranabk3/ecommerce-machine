import { Router } from 'express';
import { ProcurementController } from '../controllers/procurement.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/purchase-orders', requirePermission('procurement.view'), ProcurementController.getPurchaseOrders);
router.post('/purchase-orders', requirePermission('procurement.create'), ProcurementController.createPurchaseOrder);
router.get('/purchase-orders/:id', requirePermission('procurement.view'), ProcurementController.getPurchaseOrderById);
router.post('/purchase-orders/:id/transition', requirePermission('procurement.update'), ProcurementController.transitionStatus);
router.post('/purchase-orders/:id/items/:itemId/receive', requirePermission('procurement.receive'), ProcurementController.receiveGoods);
router.post('/auto-order', requirePermission('procurement.auto_order'), ProcurementController.autoProcurement);

export default router;
