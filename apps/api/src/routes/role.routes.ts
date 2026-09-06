import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { RoleController } from '../controllers/role.controller';

const router = Router();

router.use(authenticateToken);

// Role Management Routes (mounted at /api/v1/roles)
router.get('/', requirePermission('roles.view'), RoleController.listRoles);
router.get('/:id', requirePermission('roles.view'), RoleController.getRoleDetail);
router.post('/', requirePermission('roles.create'), RoleController.createRole);
router.patch('/:id', requirePermission('roles.update'), RoleController.updateRole);
router.post('/:id/archive', requirePermission('roles.archive'), RoleController.archiveRole);
router.post('/:id/duplicate', requirePermission('roles.create'), RoleController.duplicateRole);

export default router;

