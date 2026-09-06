import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { LocationController } from '../controllers/location.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('products.view'), LocationController.listLocations);
router.get('/:id', requirePermission('products.view'), LocationController.getLocationDetail);
router.post('/', requirePermission('products.update'), LocationController.createLocation);
router.patch('/:id', requirePermission('products.update'), LocationController.updateLocation);
router.post('/:id/archive', requirePermission('locations.archive'), LocationController.archiveLocation);

export default router;
