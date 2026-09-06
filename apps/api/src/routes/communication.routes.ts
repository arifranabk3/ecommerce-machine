import { Router } from 'express';
import { CommunicationController } from '../controllers/communication.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';

const router = Router();

// PUBLIC WEBHOOK (HMAC signature validated in service)
router.post('/webhooks/:provider', CommunicationController.handleWebhook);

// AUTHENTICATED ROUTES
router.use(authenticateToken);

// Conversations & Messages
router.get('/conversations', requirePermission('messages.view'), CommunicationController.getConversations);
router.get('/conversations/:id', requirePermission('messages.view'), CommunicationController.getConversationById);
router.get('/conversations/:conversationId/messages', requirePermission('messages.view'), CommunicationController.getMessages);
router.post('/messages', requirePermission('messages.send'), CommunicationController.sendMessage);

// Templates
router.get('/templates', requirePermission('templates.view'), CommunicationController.getTemplates);
router.post('/templates', requirePermission('templates.create'), CommunicationController.createTemplate);
router.get('/templates/:id', requirePermission('templates.view'), CommunicationController.getTemplateById);
router.post('/templates/:id/submit', requirePermission('templates.submit'), CommunicationController.submitTemplateForApproval);

// Campaigns
router.get('/campaigns', requirePermission('campaigns.view'), CommunicationController.getCampaigns);
router.post('/campaigns', requirePermission('campaigns.create'), CommunicationController.createCampaign);
router.get('/campaigns/:id', requirePermission('campaigns.view'), CommunicationController.getCampaignById);
router.post('/campaigns/:id/execute', requirePermission('campaigns.execute'), CommunicationController.executeCampaign);
router.post('/campaigns/:id/cancel', requirePermission('campaigns.cancel'), CommunicationController.cancelCampaign);

// Preferences / Consent
router.get('/preferences/:customerId', requirePermission('preferences.view'), CommunicationController.getPreferences);
router.put('/preferences/:customerId', requirePermission('communication_preferences.manage'), CommunicationController.updatePreferences);

// Notifications
router.get('/notifications', requirePermission('notifications.view'), CommunicationController.getNotifications);
router.post('/notifications/:id/read', requirePermission('notifications.manage'), CommunicationController.markNotificationAsRead);

export default router;
