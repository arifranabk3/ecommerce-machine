import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/sellzy_dev',
  MONGO_MAX_POOL_SIZE: parseInt(process.env.MONGO_MAX_POOL_SIZE || '10', 10),
  MONGO_MIN_POOL_SIZE: parseInt(process.env.MONGO_MIN_POOL_SIZE || '2', 10),
  REDIS_URI: process.env.REDIS_URI || process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-sellzy-dev-only-change-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
