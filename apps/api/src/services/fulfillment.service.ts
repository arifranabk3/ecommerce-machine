import { FulfillmentModel, IFulfillmentDocument } from '../models/Fulfillment';
import { OrderModel } from '../models/Order';
import { OrderTimelineModel } from '../models/OrderTimeline';
import { SecurityService } from './security.service';
import { emitTenantEvent } from '../events/emitter';
import { AppError } from '../middleware/error';
import { UpdateFulfillmentInput } from '@sellzy/validation';
import { FulfillmentStatus, SystemEvents } from '@sellzy/shared';

export class FulfillmentService {
  /**
   * Creates or updates a fulfillment record for an order.
   */
  static async updateFulfillment(
    tenantId: string,
    orderId: string,
    input: UpdateFulfillmentInput,
    actorUserId?: string
  ): Promise<IFulfillmentDocument> {
    const order = await OrderModel.findOne({ tenantId, _id: orderId });
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    let fulfillment = await FulfillmentModel.findOne({ tenantId, orderId });

    if (!fulfillment) {
      fulfillment = new FulfillmentModel({
        tenantId,
        orderId,
        locationId: input.locationId || 'default',
        status: input.status as FulfillmentStatus,
        trackingNumber: input.trackingNumber,
        carrierCode: input.carrierCode
      });
    } else {
      if (input.status) fulfillment.status = input.status as FulfillmentStatus;
      if (input.locationId) fulfillment.locationId = input.locationId;
      if (input.trackingNumber !== undefined) fulfillment.trackingNumber = input.trackingNumber;
      if (input.carrierCode !== undefined) fulfillment.carrierCode = input.carrierCode;
    }

    const now = new Date();
    if (input.status === FulfillmentStatus.PACKED && !fulfillment.packedAt) {
      fulfillment.packedAt = now;
    } else if (input.status === FulfillmentStatus.SHIPPED && !fulfillment.shippedAt) {
      fulfillment.shippedAt = now;
    } else if (input.status === FulfillmentStatus.DELIVERED && !fulfillment.deliveredAt) {
      fulfillment.deliveredAt = now;
    }

    await fulfillment.save();

    // Sync Order fulfillmentStatus
    order.fulfillmentStatus = fulfillment.status;
    await order.save();

    // Timeline & Audit
    await OrderTimelineModel.create({
      tenantId,
      orderId,
      event: `FULFILLMENT_UPDATED_${fulfillment.status}`,
      actorUserId,
      source: 'API',
      metadata: { status: fulfillment.status, trackingNumber: fulfillment.trackingNumber }
    });

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.FULFILLMENT_UPDATED,
        resourceType: 'Fulfillment',
        resourceId: fulfillment._id.toString(),
        after: { status: fulfillment.status, trackingNumber: fulfillment.trackingNumber },
        source: 'API',
        result: 'SUCCESS'
      });
    }

    emitTenantEvent(tenantId, SystemEvents.FULFILLMENT_UPDATED, {
      orderId,
      fulfillmentId: fulfillment._id.toString(),
      status: fulfillment.status
    });

    return fulfillment;
  }

  /**
   * Retrieves fulfillment details for an order within a tenant.
   */
  static async getFulfillmentByOrderId(tenantId: string, orderId: string): Promise<IFulfillmentDocument | null> {
    return FulfillmentModel.findOne({ tenantId, orderId });
  }

  /**
   * Lists fulfillments for a tenant with optional status filter.
   */
  static async listFulfillments(
    tenantId: string,
    options: { status?: FulfillmentStatus; page?: number; limit?: number } = {}
  ): Promise<{ items: IFulfillmentDocument[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = { tenantId };
    if (options.status) query.status = options.status;

    const [items, total] = await Promise.all([
      FulfillmentModel.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      FulfillmentModel.countDocuments(query)
    ]);

    return { items, total };
  }
}
