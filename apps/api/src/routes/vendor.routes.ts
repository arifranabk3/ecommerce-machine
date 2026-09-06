import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('vendors.view'), VendorController.getVendors);
router.post('/', requirePermission('vendors.create'), VendorController.createVendor);
router.get('/:id', requirePermission('vendors.view'), VendorController.getVendorById);
router.put('/:id', requirePermission('vendors.update'), VendorController.updateVendor);
router.post('/:id/archive', requirePermission('vendors.archive'), VendorController.archiveVendor);

// Vendor Product Mappings & Notes
router.post('/:id/products', requirePermission('vendors.manage_products'), VendorController.upsertVendorProduct);
router.delete('/:id/products/:vendorProductId', requirePermission('vendors.manage_products'), VendorController.removeVendorProduct);
router.post('/:id/notes', requirePermission('vendors.update'), VendorController.addNote);

export default router;
