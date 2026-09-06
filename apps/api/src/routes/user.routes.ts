import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.use(authenticateToken);

// User Management Routes
router.get('/', requirePermission('users.view'), UserController.listUsers);
router.get('/:id', requirePermission('users.view'), UserController.getUserDetail);
router.post('/:id/roles', requirePermission('roles.assign'), UserController.assignRoles);
router.post('/:id/status', requirePermission('users.suspend'), UserController.updateStatus);
router.post('/:id/remove', requirePermission('users.remove'), UserController.removeUser);
router.post('/:id/revoke-sessions', requirePermission('users.update'), UserController.revokeSessions);
router.post('/transfer-ownership', requirePermission('*'), UserController.transferOwnership);

export default router;
