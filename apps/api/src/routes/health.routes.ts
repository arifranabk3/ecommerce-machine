import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { redis } from '../config/redis';
import { ApiResponse } from '@sellzy/shared';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: { status: 'UP', timestamp: new Date().toISOString() }
  };
  res.status(200).json(response);
});

healthRouter.get('/db', (_req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  const response: ApiResponse = {
    success: isConnected,
    data: { status: isConnected ? 'CONNECTED' : 'DISCONNECTED' }
  };
  res.status(isConnected ? 200 : 503).json(response);
});

healthRouter.get('/redis', async (_req: Request, res: Response) => {
  try {
    const ping = await redis.ping();
    const isOk = ping === 'PONG';
    const response: ApiResponse = {
      success: isOk,
      data: { status: isOk ? 'CONNECTED' : 'UNHEALTHY' }
    };
    return res.status(isOk ? 200 : 503).json(response);
  } catch (err) {
    const response: ApiResponse = {
      success: false,
      error: { code: 'REDIS_DOWN', message: 'Redis connection check failed' }
    };
    return res.status(503).json(response);
  }
});
