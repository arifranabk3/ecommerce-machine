import { logger } from '../utils/logger';

export interface IEventEnvelope {
  eventId: string;
  tenantId: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  source: string;
  timestamp: Date;
  correlationId: string;
  causationId?: string;
}

export type EventHandler = (event: IEventEnvelope) => Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]> = new Map();
  private processedEventIds: Set<string> = new Set();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(eventType: string, handler: EventHandler): void {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  public async publish(event: IEventEnvelope): Promise<{ handled: boolean; duplicate: boolean }> {
    if (!event.eventId || !event.tenantId || !event.eventType) {
      throw new Error('Invalid event envelope: eventId, tenantId, and eventType are required');
    }

    const dedupeKey = `${event.tenantId}:${event.eventId}`;
    if (this.processedEventIds.has(dedupeKey)) {
      logger.info({ eventId: event.eventId, tenantId: event.tenantId }, 'EventBus: Duplicate event delivery ignored');
      return { handled: false, duplicate: true };
    }

    this.processedEventIds.add(dedupeKey);
    // Limit memory set size
    if (this.processedEventIds.size > 10000) {
      const first = Array.from(this.processedEventIds)[0];
      if (first) this.processedEventIds.delete(first);
    }

    const listeners = this.handlers.get(event.eventType) || [];
    const wildcardListeners = this.handlers.get('*') || [];
    const allListeners = [...listeners, ...wildcardListeners];

    for (const handler of allListeners) {
      try {
        await handler(event);
      } catch (err: any) {
        logger.error({ err, eventId: event.eventId, eventType: event.eventType }, 'Error executing event handler');
      }
    }

    return { handled: allListeners.length > 0, duplicate: false };
  }

  public clearHandlers(): void {
    this.handlers.clear();
    this.processedEventIds.clear();
  }
}
