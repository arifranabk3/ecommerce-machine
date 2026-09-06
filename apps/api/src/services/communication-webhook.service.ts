import { CommunicationWebhookEventModel } from '../models/CommunicationWebhookEvent';
import { MessageService } from './message.service';
import { MessageStatus } from '@sellzy/shared';

export class CommunicationWebhookService {
  private messageService = new MessageService();

  async processWebhookEvent(params: {
    tenantId: string;
    provider: string;
    providerEventId: string;
    eventType: string;
    payload: Record<string, any>;
    providerMessageId?: string;
    status?: MessageStatus;
  }) {
    if (!params.providerEventId || params.providerEventId.trim() === '') {
      throw new Error('Webhook processing error: providerEventId is required');
    }

    if (!params.provider || params.provider === 'unknown') {
      throw new Error('Webhook processing error: unknown provider');
    }

    // 1. Idempotency Check for Webhook Events (Never trust tenantId from inside payload!)
    try {
      await CommunicationWebhookEventModel.create({
        tenantId: params.tenantId,
        provider: params.provider,
        providerEventId: params.providerEventId,
        eventType: params.eventType,
        payload: params.payload,
        processedAt: new Date(),
      });
    } catch (err: any) {
      if (err.code === 11000) {
        // Event already processed - idempotent return
        return { duplicate: true, processed: false };
      }
      throw err;
    }

    // 2. If status update is present, sync message status safely
    if (params.providerMessageId && params.status) {
      try {
        await this.messageService.updateMessageStatus(
          params.tenantId,
          params.providerMessageId,
          params.status,
          params.payload?.error?.message
        );
      } catch (err: any) {
        // Log status update issue (e.g. invalid status transition or message not found)
      }
    }

    return { duplicate: false, processed: true };
  }
}
