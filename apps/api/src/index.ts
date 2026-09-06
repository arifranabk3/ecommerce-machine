import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app';
import { env } from '@sellzy/config';
import { connectDB, disconnectDB } from './config/database';
import { logger } from './utils/logger';

import { setSocketServer } from './events/emitter';

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.io
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST']
    }
  });

  setSocketServer(io);

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Real-time client connected via Socket.io');
    
    socket.on('join_tenant_room', (tenantId: string) => {
      socket.join(`tenant:${tenantId}`);
      logger.info({ socketId: socket.id, tenantId }, 'Socket joined tenant room');
    });

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Client disconnected');
    });
  });

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing server gracefully...');
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start Sellzy API service');
  process.exit(1);
});
