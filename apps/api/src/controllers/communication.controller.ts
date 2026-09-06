import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service';
import { MessageService } from '../services/message.service';
import { TemplateService } from '../services/template.service';
import { CampaignService } from '../services/campaign.service';
import { ConsentService } from '../services/consent.service';
import { NotificationService } from '../services/notification.service';
import { CommunicationWebhookService } from '../services/communication-webhook.service';

export class CommunicationController {
  private static conversationService = new ConversationService();
  private static messageService = new MessageService();
  private static templateService = new TemplateService();
  private static campaignService = new CampaignService();
  private static consentService = new ConsentService();
  private static notificationService = new NotificationService();
  private static webhookService = new CommunicationWebhookService();

  // CONVERSATIONS
  static async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { status, channel, page, limit } = req.query;
      const result = await CommunicationController.conversationService.getConversations(
        tenantId,
        {
          status: status as any,
          channel: channel as any,
        },
        page ? parseInt(page as string, 10) : 1,
        limit ? parseInt(limit as string, 10) : 20
      );
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getConversationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const conversation = await CommunicationController.conversationService.getConversationById(tenantId, id);
      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }
      res.status(200).json({ data: conversation });
    } catch (err) {
      next(err);
    }
  }

  // MESSAGES
  static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const senderId = (req as any).user?.id || (req as any).userId;
      const { conversationId, customerId, channel, content, templateId, mediaUrl, metadata, idempotencyKey, isMarketing } = req.body;

      if (!channel || !content) {
        res.status(400).json({ error: 'channel and content are required' });
        return;
      }

      const message = await CommunicationController.messageService.sendMessage({
        tenantId,
        conversationId,
        customerId,
        channel,
        content,
        templateId,
        mediaUrl,
        metadata,
        idempotencyKey,
        isMarketing,
        senderId,
      });

      res.status(201).json({ data: message });
    } catch (err) {
      next(err);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { conversationId } = req.params;
      const { page, limit } = req.query;

      const result = await CommunicationController.messageService.getMessages(
        tenantId,
        conversationId,
        limit ? parseInt(limit as string, 10) : 50,
        page ? parseInt(page as string, 10) : 1
      );

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  // TEMPLATES
  static async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { name, category, channel, language, subject, content, variables, header, footer, buttons } = req.body;

      if (!name || !category || !channel || !language || !content) {
        res.status(400).json({ error: 'name, category, channel, language, and content are required' });
        return;
      }

      const template = await CommunicationController.templateService.createTemplate({
        tenantId,
        name,
        category,
        channel,
        language,
        subject,
        content,
        variables,
        header,
        footer,
        buttons,
      });

      res.status(201).json({ data: template });
    } catch (err) {
      next(err);
    }
  }

  static async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { channel, category, status, language } = req.query;

      const templates = await CommunicationController.templateService.getTemplates(tenantId, {
        channel: channel as any,
        category: category as any,
        status: status as any,
        language: language as string,
      });

      res.status(200).json({ data: templates });
    } catch (err) {
      next(err);
    }
  }

  static async getTemplateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const template = await CommunicationController.templateService.getTemplateById(tenantId, id);
      if (!template) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }

      res.status(200).json({ data: template });
    } catch (err) {
      next(err);
    }
  }

  static async submitTemplateForApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const template = await CommunicationController.templateService.submitForApproval(tenantId, id);
      res.status(200).json({ data: template });
    } catch (err) {
      next(err);
    }
  }

  // CAMPAIGNS
  static async createCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { name, channel, templateId, subject, content, audienceFilter, scheduledAt, idempotencyKey } = req.body;

      if (!name || !channel || !content) {
        res.status(400).json({ error: 'name, channel, and content are required' });
        return;
      }

      const campaign = await CommunicationController.campaignService.createCampaign({
        tenantId,
        name,
        channel,
        templateId,
        subject,
        content,
        audienceFilter,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        idempotencyKey,
      });

      res.status(201).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  }

  static async getCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { page, limit } = req.query;

      const result = await CommunicationController.campaignService.getCampaigns(
        tenantId,
        page ? parseInt(page as string, 10) : 1,
        limit ? parseInt(limit as string, 10) : 20
      );

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCampaignById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const campaign = await CommunicationController.campaignService.getCampaignById(tenantId, id);
      if (!campaign) {
        res.status(404).json({ error: 'Campaign not found' });
        return;
      }

      res.status(200).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  }

  static async executeCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const campaign = await CommunicationController.campaignService.executeCampaign(tenantId, id);
      res.status(200).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  }

  static async cancelCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const campaign = await CommunicationController.campaignService.cancelCampaign(tenantId, id);
      res.status(200).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  }

  // CONSENT PREFERENCES
  static async getPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { customerId } = req.params;

      const pref = await CommunicationController.consentService.getPreferences(tenantId, customerId);
      res.status(200).json({ data: pref });
    } catch (err) {
      next(err);
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { customerId } = req.params;
      const { channels, topics } = req.body;

      const pref = await CommunicationController.consentService.updatePreferences(
        tenantId,
        customerId,
        channels,
        topics,
        { ipAddress: req.ip, userAgent: req.get('user-agent') }
      );

      res.status(200).json({ data: pref });
    } catch (err) {
      next(err);
    }
  }

  // NOTIFICATIONS
  static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { customerId, userId, isRead, page, limit } = req.query;

      const result = await CommunicationController.notificationService.getNotifications({
        tenantId,
        customerId: customerId as string,
        userId: userId as string,
        isRead: isRead !== undefined ? isRead === 'true' : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  static async markNotificationAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const notification = await CommunicationController.notificationService.markAsRead(tenantId, id);
      res.status(200).json({ data: notification });
    } catch (err) {
      next(err);
    }
  }

  // WEBHOOKS
  static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId || (req.headers['x-tenant-id'] as string) || 'default_tenant';
      const { provider } = req.params;
      const { eventId, eventType, payload, providerMessageId, status } = req.body;

      if (!eventId) {
        res.status(400).json({ error: 'eventId is required' });
        return;
      }

      const result = await CommunicationController.webhookService.processWebhookEvent({
        tenantId,
        provider: provider || 'unknown',
        providerEventId: eventId,
        eventType: eventType || 'message.status',
        payload: payload || req.body,
        providerMessageId,
        status,
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}
