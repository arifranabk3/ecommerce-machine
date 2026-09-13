import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { WarehouseController } from '../controllers/warehouse.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('products.view'), WarehouseController.listLocations);
router.get('/:id', requirePermission('products.view'), WarehouseController.getLocationById);
router.post('/', requirePermission('products.update'), WarehouseController.createLocation);
router.patch('/:id', requirePermission('products.update'), WarehouseController.updateLocation);
router.post('/:id/archive', requirePermission('locations.archive'), WarehouseController.archiveLocation);

export default router;
