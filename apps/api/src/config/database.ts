import mongoose from 'mongoose';
import { env } from '@sellzy/config';
import { logger } from '../utils/logger';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error encountered');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    const isProdOrStaging = env.NODE_ENV === 'production' || env.NODE_ENV === 'staging';

    await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: env.MONGO_MAX_POOL_SIZE,
      minPoolSize: env.MONGO_MIN_POOL_SIZE,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: !isProdOrStaging,
    });

    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}
