import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/brief', requirePermission('ai.view'), AiController.getDailyBrief);
router.post('/classify', requirePermission('ai.use'), AiController.classifyMessage);
router.post('/draft', requirePermission('ai.use'), AiController.draftResponse);
router.post('/tool', requirePermission('ai.use'), AiController.executeTool);

export default router;
