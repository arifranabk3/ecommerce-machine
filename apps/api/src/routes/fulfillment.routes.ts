import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', requirePermission('orders.view'), OrderController.listFulfillments);

export const fulfillmentRoutes = router;
