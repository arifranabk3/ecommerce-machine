import { PlanModel } from '../models/Plan';
import { TenantModel } from '../models/Tenant';
import { UsageTrackerModel } from '../models/UsageTracker';
import { AppError } from '../middleware/error';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class EntitlementService {
  static async canTenantUseFeature(tenantId: string, featureKey: string): Promise<boolean> {
    // 1. Check namespaced Redis cache: tenant:{tenantId}:features
    const cacheKey = `tenant:${tenantId}:features`;
    if (redis.status === 'ready') {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const features = JSON.parse(cached);
          return Boolean(features[featureKey]);
        }
      } catch (e) {}
    }

    // 2. Query Tenant & Plan
    const tenant = await TenantModel.findOne({ tenantId, status: { $in: ['ACTIVE', 'TRIAL'] } });
    if (!tenant) return false;

    // Direct feature overrides
    if (tenant.featureConfig && tenant.featureConfig[featureKey] !== undefined) {
      return tenant.featureConfig[featureKey];
    }

    const plan = await PlanModel.findOne({ planId: tenant.planId });
    const hasFeature = Boolean(plan?.features.includes(featureKey) || plan?.features.includes('*'));

    // Cache result
    if (redis.status === 'ready') {
      try {
        const featureMap = { [featureKey]: hasFeature };
        await redis.setex(cacheKey, 300, JSON.stringify(featureMap));
      } catch (e) {}
    }

    return hasFeature;
  }

  static async checkTenantLimit(tenantId: string, metric: string, delta = 1): Promise<boolean> {
    const tenant = await TenantModel.findOne({ tenantId });
    if (!tenant) throw new AppError('Tenant not found', 404, 'TENANT_NOT_FOUND');

    const plan = await PlanModel.findOne({ planId: tenant.planId });
    const period = new Date().toISOString().substring(0, 7); // YYYY-MM

    let maxLimit = 1000;
    if (plan && plan.limits) {
      if (metric === 'maxUsers') maxLimit = plan.limits.maxUsers;
      if (metric === 'maxOrdersPerMonth') maxLimit = plan.limits.maxOrdersPerMonth;
      if (metric === 'maxProducts') maxLimit = plan.limits.maxProducts;
      if (metric === 'maxVendors') maxLimit = plan.limits.maxVendors;
    }

    const usage = await UsageTrackerModel.findOneAndUpdate(
      { tenantId, metric, period },
      { $setOnInsert: { limit: maxLimit }, $inc: { currentUsage: delta } },
      { upsert: true, new: true }
    );

    if (usage.currentUsage > maxLimit) {
      logger.warn({ tenantId, metric, currentUsage: usage.currentUsage, limit: maxLimit }, 'Tenant usage limit reached');
      return false;
    }

    return true;
  }
}
