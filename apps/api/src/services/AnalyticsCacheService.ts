import { redis } from '../config/redis';
import crypto from 'crypto';

export class AnalyticsCacheService {
  private static TTL_SECONDS = 300; // 5 minutes cache

  static generateCacheKey(tenantId: string, metric: string, filters: Record<string, unknown>): string {
    const sortedFilters = filters ? Object.keys(filters).sort().reduce((acc: any, key) => { acc[key] = filters[key]; return acc; }, {}) : {};
    const filterHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(sortedFilters))
      .digest('hex')
      .substring(0, 16);
    return `analytics:${tenantId}:${metric}:${filterHash}`;
  }

  static async get<T>(tenantId: string, metric: string, filters: Record<string, unknown>): Promise<T | null> {
    if (redis.status !== 'ready') return null;
    try {
      const key = this.generateCacheKey(tenantId, metric, filters);
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (_e) {
      return null;
    }
  }

  static async set(tenantId: string, metric: string, filters: Record<string, unknown>, data: unknown): Promise<void> {
    if (redis.status !== 'ready') return;
    try {
      const key = this.generateCacheKey(tenantId, metric, filters);
      await redis.setex(key, this.TTL_SECONDS, JSON.stringify(data));
    } catch (_e) {}
  }

  static async invalidateTenantCache(tenantId: string): Promise<void> {
    if (redis.status !== 'ready') return;
    try {
      const keys = await redis.keys(`analytics:${tenantId}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (_e) {}
  }
}
