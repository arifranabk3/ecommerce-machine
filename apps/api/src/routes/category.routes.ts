import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('products.view'), CategoryController.listCategories);
router.get('/:id', requirePermission('products.view'), CategoryController.getCategoryDetail);
router.post('/', requirePermission('products.create'), CategoryController.createCategory);
router.patch('/:id', requirePermission('products.update'), CategoryController.updateCategory);
router.post('/:id/archive', requirePermission('categories.archive'), CategoryController.archiveCategory);

export default router;
