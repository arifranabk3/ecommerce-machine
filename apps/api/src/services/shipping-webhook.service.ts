import { ShippingWebhookEventModel } from '../models/ShippingWebhookEvent';
import { ShipmentModel } from '../models/Shipment';
import { ShipmentService } from './shipment.service';
import { MockCourierProvider } from '../providers/courier/mock-courier.provider';
import { ShipmentStatus } from '@sellzy/shared';

export interface IProcessShippingWebhookParams {
  courier: string;
  headers: Record<string, string>;
  rawBody: string | Buffer;
}

export class ShippingWebhookService {
  private static mockCourierProvider = new MockCourierProvider();

  static async processWebhook(params: IProcessShippingWebhookParams): Promise<{
    status: 'PROCESSED' | 'IGNORED' | 'FAILED';
    eventId: string;
    message: string;
  }> {
    const { courier, headers, rawBody } = params;

    const verifyRes = await this.mockCourierProvider.verifyWebhook(headers, rawBody);
    if (!verifyRes.isValid) {
      throw new Error('Invalid courier webhook signature or payload integrity check failed.');
    }

    const { providerEventId = `evt_${Date.now()}`, trackingNumber, shipmentId, status: newStatus } = verifyRes;

    // Idempotency check: courier + providerEventId unique
    const existing = await ShippingWebhookEventModel.findOne({ courier, providerEventId });
    if (existing && existing.status === 'PROCESSED') {
      return {
        status: 'IGNORED',
        eventId: providerEventId,
        message: 'Duplicate courier webhook event already processed.'
      };
    }

    // Lookup shipment
    let shipment;
    if (shipmentId) {
      shipment = await ShipmentModel.findOne({ _id: shipmentId });
    } else if (trackingNumber) {
      shipment = await ShipmentModel.findOne({ trackingNumber });
    }

    const tenantId = shipment ? shipment.tenantId : 'system';

    let webhookRecord = existing;
    if (!webhookRecord) {
      try {
        webhookRecord = new ShippingWebhookEventModel({
          tenantId,
          courier,
          providerEventId,
          eventType: verifyRes.eventType || 'STATUS_UPDATE',
          shipmentId: shipment ? shipment._id.toString() : undefined,
          status: 'PENDING'
        });
        await webhookRecord.save();
      } catch (err: any) {
        if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
          return {
            status: 'IGNORED',
            eventId: providerEventId,
            message: 'Duplicate courier webhook event already processed.'
          };
        }
        throw err;
      }
    }

    try {
      if (shipment && newStatus) {
        await ShipmentService.updateShipmentStatus(
          shipment.tenantId,
          shipment._id.toString(),
          newStatus,
          verifyRes.eventType,
          undefined,
          `Webhook update from courier ${courier}`,
          'COURIER'
        );
      }

      webhookRecord.status = 'PROCESSED';
      webhookRecord.processedAt = new Date();
      await webhookRecord.save();

      return {
        status: 'PROCESSED',
        eventId: providerEventId,
        message: 'Shipping webhook processed successfully.'
      };
    } catch (err: any) {
      webhookRecord.status = 'FAILED';
      await webhookRecord.save();
      throw err;
    }
  }
}
