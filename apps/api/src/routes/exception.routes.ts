import { Router } from 'express';
import { ExceptionController } from '../controllers/exception.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('automation.exceptions.view'), ExceptionController.getExceptions);
router.get('/:id', requirePermission('automation.exceptions.view'), ExceptionController.getById);
router.post('/:id/resolve', requirePermission('automation.exceptions.resolve'), ExceptionController.resolve);
router.patch('/:id/status', requirePermission('automation.exceptions.manage'), ExceptionController.updateStatus);

export default router;
