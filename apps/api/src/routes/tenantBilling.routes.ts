import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { EntitlementService } from '../services/EntitlementService';
import { SaaSBillingService } from '../services/SaaSBillingService';
import { ApiKeyService } from '../services/ApiKeyService';
import { OutboundWebhookService } from '../services/OutboundWebhookService';
import { ApiKeyModel } from '../models/ApiKey';
import { WebhookEndpointModel } from '../models/WebhookEndpoint';
import { WebhookDeliveryLogModel } from '../models/WebhookDeliveryLog';

const router = Router();

// Public billing webhooks endpoint (with signature & idempotency)
router.post('/billing/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId, eventType, provider, tenantId } = req.body;
    const result = await SaaSBillingService.handleBillingWebhook({
      eventId: eventId || 'evt_mock',
      eventType: eventType || 'subscription.updated',
      provider: provider || 'STRIPE',
      tenantId: tenantId || 'tn_default'
    });
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

router.use(authenticateToken);

/**
 * GET /api/v1/billing/usage
 */
router.get('/billing/usage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const usage = await EntitlementService.getTenantUsage(tenantId);
    res.json({ success: true, usage });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/billing/subscription
 */
router.post('/billing/subscription', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const { planSlug, billingCycle } = req.body;
    const subscription = await SaaSBillingService.createSubscription(tenantId, planSlug, billingCycle);
    res.json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
});

/**
 * API Key Endpoints
 */
router.get('/api-keys', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const keys = await ApiKeyModel.find({ tenantId, revokedAt: { $in: [null, undefined] } }).select('-keyHash');
    res.json({ success: true, keys });

  } catch (err) {
    next(err);
  }
});

router.post('/api-keys', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const { name, scopes } = req.body;
    const created = await ApiKeyService.createApiKey(tenantId, name, scopes);
    res.status(201).json({ success: true, ...created });
  } catch (err) {
    next(err);
  }
});

router.post('/api-keys/:id/revoke', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const key = await ApiKeyService.revokeApiKey(tenantId, req.params.id);
    res.json({ success: true, key });
  } catch (err) {
    next(err);
  }
});

/**
 * Webhook Endpoints
 */
router.get('/webhooks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const endpoints = await WebhookEndpointModel.find({ tenantId }).select('-signingSecret');
    res.json({ success: true, endpoints });
  } catch (err) {
    next(err);
  }
});

router.post('/webhooks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const { url, events } = req.body;
    const endpoint = await OutboundWebhookService.registerEndpoint(tenantId, url, events);
    res.status(201).json({ success: true, endpoint });
  } catch (err) {
    next(err);
  }
});

router.get('/webhooks/logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const logs = await WebhookDeliveryLogModel.find({ tenantId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
});

export const tenantBillingRouter = router;
