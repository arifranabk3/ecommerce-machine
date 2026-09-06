import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('orders.view'), OrderController.listOrders);
router.post('/', requirePermission('orders.create'), OrderController.createOrder);
router.get('/:id', requirePermission('orders.view'), OrderController.getOrderById);
router.patch('/:id', requirePermission('orders.update'), OrderController.updateOrder);

router.post('/:id/confirm', requirePermission('orders.confirm'), OrderController.confirmOrder);
router.post('/:id/process', requirePermission('orders.update'), OrderController.processOrder);
router.post('/:id/hold', requirePermission('orders.hold'), OrderController.holdOrder);
router.post('/:id/cancel', requirePermission('orders.cancel'), OrderController.cancelOrder);

router.post('/:id/fulfillment', requirePermission('orders.fulfill'), OrderController.updateFulfillment);
router.patch('/:id/fulfillment', requirePermission('orders.fulfill'), OrderController.updateFulfillment);

router.post('/:id/notes', requirePermission('orders.update'), OrderController.addOrderNote);

export const orderRoutes = router;
