import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { RoleController } from '../controllers/role.controller';

const router = Router();

router.use(authenticateToken);

// Permissions Catalog Route (mounted at /api/v1/permissions)
router.get('/', requirePermission('roles.view'), RoleController.listPermissionsCatalog);

export default router;
