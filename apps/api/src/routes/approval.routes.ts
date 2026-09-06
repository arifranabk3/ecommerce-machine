import { Router } from 'express';
import { ApprovalController } from '../controllers/approval.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', requirePermission('automation.approvals.view'), ApprovalController.getPending);
router.get('/:id', requirePermission('automation.approvals.view'), ApprovalController.getById);
router.post('/:id/approve', requirePermission('automation.approvals.approve'), ApprovalController.approve);
router.post('/:id/reject', requirePermission('automation.approvals.reject'), ApprovalController.reject);

export default router;
