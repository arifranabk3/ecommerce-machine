import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

let ioInstance: SocketIOServer | null = null;

export function setSocketServer(io: SocketIOServer) {
  ioInstance = io;
}

export function emitTenantEvent(tenantId: string, eventName: string, payload: Record<string, unknown>) {
  if (ioInstance) {
    const room = `tenant:${tenantId}`;
    ioInstance.to(room).emit(eventName, { tenantId, event: eventName, payload, timestamp: new Date() });
    logger.info({ tenantId, eventName, room }, 'Emitted tenant-isolated Socket.IO event');
  }
}
