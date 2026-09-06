import { Router, Request, Response, NextFunction } from 'express';
import { RbacService } from '../services/rbac.service';
import { AppError } from '../middleware/error';
import { authenticateToken } from '../middleware/auth';
import { UserModel } from '../models/User';
import { SaaSPlanModel } from '../models/Plan';
import { SaaSSubscriptionModel } from '../models/Subscription';
import { FeatureFlagModel } from '../models/FeatureFlag';
import { PlatformSettingsModel } from '../models/PlatformSettings';
import { PlatformHealthService } from '../services/PlatformHealthService';
import { PlatformAuditService } from '../services/PlatformAuditService';

const router = Router();

// Public health probes
router.get('/live', (req: Request, res: Response) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

router.get('/ready', (req: Request, res: Response) => {
  res.json({ status: 'ready', timestamp: new Date().toISOString() });
});

router.use(authenticateToken);

// Middleware helper to enforce Platform Super Admin RBAC permissions
function requirePlatformPermission(permissionKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const tenantId = (req as any).user.tenantId;

      const userPermissions = await RbacService.getEffectivePermissions(userId, tenantId);
      
      if (!userPermissions.includes('*') && !userPermissions.includes(permissionKey)) {
        return next(new AppError(`Platform permission ${permissionKey} required`, 403, 'FORBIDDEN'));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * GET /api/v1/platform/tenants
 */
router.get('/tenants', requirePlatformPermission('platform.tenants.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await UserModel.aggregate([
      { $group: { _id: '$tenantId', userCount: { $sum: 1 }, createdAt: { $min: '$createdAt' } } },
      { $sort: { createdAt: -1 } }
    ]);
    res.json({ success: true, tenants });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/platform/tenants/:id
 */
router.get('/tenants/:id', requirePlatformPermission('platform.tenants.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetTenantId = req.params.id;
    const usersCount = await UserModel.countDocuments({ tenantId: targetTenantId });
    const sub = await SaaSSubscriptionModel.findOne({ tenantId: targetTenantId });
    res.json({ success: true, tenantId: targetTenantId, usersCount, subscription: sub });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/platform/tenants/:id/suspend
 */
router.post('/tenants/:id/suspend', requirePlatformPermission('platform.tenants.suspend'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetTenantId = req.params.id;
    const { reason } = req.body;
    if (!reason) return next(new AppError('Reason required for tenant suspension', 400, 'BAD_REQUEST'));

    await UserModel.updateMany({ tenantId: targetTenantId }, { status: 'SUSPENDED' });

    await PlatformAuditService.record({
      actorId: (req as any).user.userId,
      action: 'TENANT_SUSPENDED',
      resource: 'Tenant',
      resourceId: targetTenantId,
      tenantId: targetTenantId,
      reason,
      result: 'SUCCESS'
    });

    res.json({ success: true, message: `Tenant ${targetTenantId} suspended` });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/platform/tenants/:id/reactivate
 */
router.post('/tenants/:id/reactivate', requirePlatformPermission('platform.tenants.reactivate'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetTenantId = req.params.id;
    await UserModel.updateMany({ tenantId: targetTenantId }, { status: 'ACTIVE' });

    await PlatformAuditService.record({
      actorId: (req as any).user.userId,
      action: 'TENANT_REACTIVATED',
      resource: 'Tenant',
      resourceId: targetTenantId,
      tenantId: targetTenantId,
      result: 'SUCCESS'
    });

    res.json({ success: true, message: `Tenant ${targetTenantId} reactivated` });
  } catch (err) {
    next(err);
  }
});

/**
 * SaaS Plans API
 */
router.get('/plans', requirePlatformPermission('platform.plans.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await SaaSPlanModel.find().sort({ monthlyPriceMinor: 1 });
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
});

router.post('/plans', requirePlatformPermission('platform.plans.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, monthlyPriceMinor, yearlyPriceMinor, limits, features } = req.body;
    const plan = await SaaSPlanModel.create({
      name,
      slug: slug.toUpperCase(),
      description,
      monthlyPriceMinor,
      yearlyPriceMinor,
      limits,
      features
    });
    res.status(201).json({ success: true, plan });
  } catch (err) {
    next(err);
  }
});

/**
 * Subscriptions API
 */
router.get('/subscriptions', requirePlatformPermission('platform.subscriptions.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await SaaSSubscriptionModel.find().sort({ createdAt: -1 });
    res.json({ success: true, subscriptions });
  } catch (err) {
    next(err);
  }
});

router.post('/subscriptions/:tenantId/override', requirePlatformPermission('platform.subscriptions.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { planSlug } = req.body;
    const sub = await SaaSSubscriptionModel.findOneAndUpdate(
      { tenantId: req.params.tenantId },
      { planId: planSlug.toUpperCase() },
      { new: true, upsert: true }
    );
    res.json({ success: true, subscription: sub });
  } catch (err) {
    next(err);
  }
});

/**
 * System Health & Queue Monitoring
 */
router.get('/health', requirePlatformPermission('platform.system_health.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await PlatformHealthService.getSystemHealth();
    res.json({ success: true, health });
  } catch (err) {
    next(err);
  }
});

router.get('/queues', requirePlatformPermission('platform.queues.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queues = [
      { name: 'emails', waiting: 0, active: 1, completed: 1500, failed: 2, delay: 0 },
      { name: 'webhooks', waiting: 0, active: 0, completed: 3200, failed: 0, delay: 0 },
      { name: 'exports', waiting: 0, active: 0, completed: 45, failed: 0, delay: 0 },
      { name: 'automation', waiting: 0, active: 0, completed: 980, failed: 1, delay: 0 }
    ];
    res.json({ success: true, queues });
  } catch (err) {
    next(err);
  }
});

router.get('/queues/failed', requirePlatformPermission('platform.queues.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, failedJobs: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/queues/retry', requirePlatformPermission('platform.queues.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, retried: true });
  } catch (err) {
    next(err);
  }
});

/**
 * Feature Flags, Settings & Integrations Hub
 */
router.get('/integrations', requirePlatformPermission('platform.integrations.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const integrations = [
      { provider: 'STRIPE', category: 'Payments', status: 'CONNECTED', health: 'HEALTHY' },
      { provider: 'WHATSAPP', category: 'Communication', status: 'CONNECTED', health: 'HEALTHY' },
      { provider: 'TWILIO', category: 'Communication', status: 'DISCONNECTED', health: 'UNKNOWN' },
      { provider: 'SHIPROCKET', category: 'Shipping', status: 'CONNECTED', health: 'HEALTHY' }
    ];
    res.json({ success: true, integrations });
  } catch (err) {
    next(err);
  }
});

router.get('/feature-flags', requirePlatformPermission('platform.settings.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flags = await FeatureFlagModel.find();
    res.json({ success: true, flags });
  } catch (err) {
    next(err);
  }
});

router.post('/feature-flags', requirePlatformPermission('platform.settings.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, description, enabled, global, tenantIds } = req.body;
    const flag = await FeatureFlagModel.findOneAndUpdate(
      { key },
      { key, description, enabled, global, tenantIds },
      { new: true, upsert: true }
    );
    res.json({ success: true, flag });
  } catch (err) {
    next(err);
  }
});

router.get('/settings', requirePlatformPermission('platform.settings.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await PlatformSettingsModel.findOne({ globalKey: 'GLOBAL' });
    if (!settings) {
      settings = await PlatformSettingsModel.create({ globalKey: 'GLOBAL' });
    }
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

router.post('/settings', requirePlatformPermission('platform.settings.manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = req.body;
    const settings = await PlatformSettingsModel.findOneAndUpdate(
      { globalKey: 'GLOBAL' },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

router.get('/audit', requirePlatformPermission('platform.audit.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await PlatformAuditService.listLogs();
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
});

export const platformRouter = router;
