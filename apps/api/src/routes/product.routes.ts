import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.use(authenticateToken);

// Product CRUD routes
router.get('/', requirePermission('products.view'), ProductController.listProducts);
router.get('/:id', requirePermission('products.view'), ProductController.getProductDetail);
router.post('/', requirePermission('products.create'), ProductController.createProduct);
router.patch('/:id', requirePermission('products.update'), ProductController.updateProduct);
router.post('/:id/archive', requirePermission('products.archive'), ProductController.archiveProduct);

// Variant management routes
router.post('/:id/variants', requirePermission('products.create'), ProductController.createVariant);
router.patch('/:id/variants/:variantId', requirePermission('products.update'), ProductController.updateVariant);
router.post('/:id/variants/:variantId/archive', requirePermission('products.archive'), ProductController.archiveVariant);

export default router;
