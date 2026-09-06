import { Router } from 'express';
import { ShippingController } from '../controllers/shipping.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

// PUBLIC COURIER WEBHOOK
router.post('/webhooks/:courier', ShippingController.handleWebhook);

// Authenticated Shipping Routes
router.use(authenticateToken);

router.get('/shipments', requirePermission('shipping.view'), ShippingController.getShipments);
router.post('/shipments', requirePermission('shipping.create'), ShippingController.createShipment);
router.get('/shipments/:id', requirePermission('shipping.view'), ShippingController.getShipmentById);
router.post('/shipments/:id/cancel', requirePermission('shipping.cancel'), ShippingController.cancelShipment);

router.get('/rto', requirePermission('rto.view'), ShippingController.getRTOList);
router.post('/rto', requirePermission('rto.manage'), ShippingController.initiateRTO);

// Returns Sub-Router
export const returnsRouter = Router();
returnsRouter.use(authenticateToken);

returnsRouter.get('/', requirePermission('returns.view'), ShippingController.getReturns);
returnsRouter.post('/', requirePermission('returns.create'), ShippingController.requestReturn);
returnsRouter.post('/:id/approve', requirePermission('returns.approve'), ShippingController.approveReturn);
returnsRouter.post('/:id/inspect', requirePermission('returns.inspect'), ShippingController.inspectReturn);

// Courier Settings Sub-Router
export const courierSettingsRouter = Router();
courierSettingsRouter.use(authenticateToken);

courierSettingsRouter.get('/', requirePermission('couriers.view'), ShippingController.getCouriers);
courierSettingsRouter.post('/', requirePermission('couriers.manage'), ShippingController.createCourier);

export default router;
