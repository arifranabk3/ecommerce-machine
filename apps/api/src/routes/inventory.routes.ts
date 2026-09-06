import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();

router.use(authenticateToken);

router.post('/adjustments', requirePermission('inventory.adjust'), InventoryController.adjustStock);
router.post('/transfers', requirePermission('inventory.transfer'), InventoryController.transferStock);
router.post('/reservations', requirePermission('inventory.reserve'), InventoryController.reserveStock);
router.post('/reservations/:reservationId/release', requirePermission('inventory.reserve'), InventoryController.releaseReservation);
router.get('/locations/:locationId', requirePermission('inventory.view'), InventoryController.getInventoryByLocation);
router.get('/movements', requirePermission('inventory.view'), InventoryController.getMovements);
router.get('/alerts/low-stock', requirePermission('inventory.view'), InventoryController.getLowStockAlerts);

export default router;
