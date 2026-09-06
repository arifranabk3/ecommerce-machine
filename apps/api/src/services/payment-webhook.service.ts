import crypto from 'crypto';
import { PaymentWebhookEventModel, IPaymentWebhookEventDocument } from '../models/PaymentWebhookEvent';
import { PaymentModel } from '../models/Payment';
import { PaymentService } from './payment.service';
import { MockPaymentProvider } from '../providers/mock-payment.provider';
import { PaymentStatus } from '@sellzy/shared';

export interface IProcessWebhookParams {
  provider: string;
  headers: Record<string, string>;
  rawBody: string | Buffer;
}

export class PaymentWebhookService {
  private static mockProvider = new MockPaymentProvider();

  /**
   * Processes incoming payment provider webhooks with raw body signature verification
   * and idempotency deduplication.
   */
  static async processWebhook(params: IProcessWebhookParams): Promise<{
    status: 'PROCESSED' | 'IGNORED' | 'FAILED';
    eventId: string;
    message: string;
  }> {
    const { provider, headers, rawBody } = params;

    // Verify webhook signature
    const verifyRes = await this.mockProvider.verifyWebhook(headers, rawBody);
    if (!verifyRes.isValid) {
      throw new Error('Invalid webhook signature or payload integrity check failed.');
    }

    const { providerEventId, eventType, paymentId, orderId, status: newStatus, amountMinor, currency } = verifyRes;

    // Idempotency check: provider + providerEventId unique
    const existing = await PaymentWebhookEventModel.findOne({ provider, providerEventId });
    if (existing && existing.status === 'PROCESSED') {
      return {
        status: 'IGNORED',
        eventId: providerEventId,
        message: 'Duplicate webhook event already processed.'
      };
    }

    const webhookRecord =
      existing ||
      new PaymentWebhookEventModel({
        tenantId: verifyRes.tenantId || 'system',
        provider,
        providerEventId,
        eventType,
        paymentId,
        status: 'PENDING'
      });

    try {
      if (paymentId) {
        const payment = await PaymentModel.findOne({ _id: paymentId });
        if (payment) {
          // Amount & currency verification check
          if (amountMinor !== undefined && amountMinor !== payment.amountMinor) {
            throw new Error(`Webhook amount (${amountMinor}) does not match server payment amount (${payment.amountMinor})`);
          }
          if (currency !== undefined && currency.toUpperCase() !== payment.currency) {
            throw new Error(`Webhook currency (${currency}) does not match server payment currency (${payment.currency})`);
          }

          if (newStatus === PaymentStatus.CAPTURED && payment.status !== PaymentStatus.CAPTURED) {
            await PaymentService.capturePayment(payment.tenantId, payment._id.toString(), verifyRes.payload?.providerPaymentId);
          }
        }
      }

      webhookRecord.status = 'PROCESSED';
      webhookRecord.processedAt = new Date();
      await webhookRecord.save();

      return {
        status: 'PROCESSED',
        eventId: providerEventId,
        message: 'Webhook processed successfully.'
      };
    } catch (err: any) {
      webhookRecord.status = 'FAILED';
      await webhookRecord.save();
      throw err;
    }
  }
}
