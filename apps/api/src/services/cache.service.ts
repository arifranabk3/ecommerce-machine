import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class CacheService {
  private static formatTenantKey(tenantId: string, resource: string, id: string): string {
    return `tenant:${tenantId}:${resource}:${id}`;
  }

  static async setTenantCache(tenantId: string, resource: string, id: string, data: any, ttlSeconds = 300): Promise<void> {
    try {
      const key = this.formatTenantKey(tenantId, resource, id);
      await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    } catch (err) {
      logger.error({ err, tenantId, resource, id }, 'Redis set cache failed');
    }
  }

  static async getTenantCache<T>(tenantId: string, resource: string, id: string): Promise<T | null> {
    try {
      const key = this.formatTenantKey(tenantId, resource, id);
      const cached = await redis.get(key);
      if (!cached) return null;
      return JSON.parse(cached) as T;
    } catch (err) {
      logger.error({ err, tenantId, resource, id }, 'Redis get cache failed');
      return null;
    }
  }

  static async invalidateTenantCache(tenantId: string, resource: string, id: string): Promise<void> {
    try {
      const key = this.formatTenantKey(tenantId, resource, id);
      await redis.del(key);
    } catch (err) {
      logger.error({ err, tenantId, resource, id }, 'Redis invalidate cache failed');
    }
  }
}
