import { Router } from 'express';
import { AutomationController } from '../controllers/automation.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', requirePermission('automation.create'), AutomationController.createWorkflow);
router.get('/', requirePermission('automation.view'), AutomationController.getWorkflows);
router.get('/runs', requirePermission('automation.view'), AutomationController.getWorkflowRuns);
router.get('/:id', requirePermission('automation.view'), AutomationController.getWorkflowById);
router.patch('/:id/status', requirePermission('automation.update'), AutomationController.updateWorkflowStatus);
router.post('/kill-switch', requirePermission('automation.update'), AutomationController.toggleKillSwitch);
router.post('/execute', requirePermission('automation.execute'), AutomationController.executeTrigger);

export default router;
