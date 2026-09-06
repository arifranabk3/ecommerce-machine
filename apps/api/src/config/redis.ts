import Redis from 'ioredis';
import { env } from '@sellzy/config';
import { logger } from '../utils/logger';

export const redis = new Redis(env.REDIS_URI, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

redis.on('error', (err) => {
  logger.error({ err }, 'Redis client error');
});
