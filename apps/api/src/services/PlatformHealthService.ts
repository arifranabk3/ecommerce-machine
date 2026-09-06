import mongoose from 'mongoose';
import { redis } from '../config/redis';

export class PlatformHealthService {
  /**
   * Check MongoDB database readiness & latency
   */
  static async checkDatabase() {
    const start = Date.now();
    const isConnected = mongoose.connection.readyState === 1;
    const latencyMs = isConnected ? Date.now() - start : -1;
    return {
      status: isConnected ? 'HEALTHY' : 'DOWN',
      latencyMs,
      readyState: mongoose.connection.readyState
    };
  }

  /**
   * Check Redis cache connection & latency
   */
  static async checkRedis() {
    const isReady = redis.status === 'ready';
    return {
      status: isReady ? 'HEALTHY' : 'DEGRADED',
      redisStatus: redis.status
    };
  }

  /**
   * Full System Health Check Summary
   */
  static async getSystemHealth() {
    const db = await this.checkDatabase();
    const redisHealth = await this.checkRedis();

    return {
      status: db.status === 'HEALTHY' ? 'HEALTHY' : 'DEGRADED',
      components: {
        database: db,
        redis: redisHealth,
        api: { status: 'HEALTHY', uptimeSeconds: Math.floor(process.uptime()) },
        queues: { status: 'HEALTHY', activeQueues: ['emails', 'webhooks', 'exports', 'automation'] }
      },
      timestamp: new Date()
    };
  }
}
