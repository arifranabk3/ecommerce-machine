import { ShipmentModel, IShipmentDocument } from '../models/Shipment';
import { ShipmentItemModel, IShipmentItemDocument } from '../models/ShipmentItem';
import { OrderModel } from '../models/Order';
import { OrderItemModel } from '../models/OrderItem';
import { CourierModel } from '../models/Courier';
import { ShipmentTrackingEventModel } from '../models/ShipmentTrackingEvent';
import { ShipmentExceptionModel } from '../models/ShipmentException';
import { ShipmentNumberService } from './shipment-number.service';
import { ShipmentStateMachine } from './shipment-state-machine';
import { MockCourierProvider } from '../providers/courier/mock-courier.provider';
import { ShipmentStatus, ShipmentExceptionType } from '@sellzy/shared';

export interface ICreateShipmentParams {
  tenantId: string;
  orderId: string;
  fulfillmentId?: string;
  courierId: string;
  items: {
    orderItemId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    unitPriceMinor?: number;
    vendorCostMinor?: number;
  }[];
  shippingCostMinor?: number;
  codAmountMinor?: number;
  packageCount?: number;
  createdBy?: string;
}

export class ShipmentService {
  private static mockProvider = new MockCourierProvider();

  static async createShipment(params: ICreateShipmentParams): Promise<IShipmentDocument> {
    const { tenantId, orderId, fulfillmentId, courierId, items, shippingCostMinor = 0, codAmountMinor = 0, packageCount = 1, createdBy } = params;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Shipment items array cannot be empty');
    }

    const order = await OrderModel.findOne({ _id: orderId, tenantId });
    if (!order) {
      throw new Error(`Order not found for ID ${orderId}`);
    }

    const orderItems = await OrderItemModel.find({ tenantId, orderId });

    const courier = await CourierModel.findOne({ _id: courierId, tenantId });
    const courierName = courier ? courier.name : 'Standard Courier';

    // Verify quantity integrity across existing shipments for this order
    const existingShipmentItems = await ShipmentItemModel.find({ tenantId, orderId });
    const shippedQtyMap: Record<string, number> = {};
    for (const item of existingShipmentItems) {
      shippedQtyMap[item.orderItemId] = (shippedQtyMap[item.orderItemId] || 0) + item.quantity;
    }

    for (const newItem of items) {
      if (!newItem.quantity || newItem.quantity <= 0) {
        throw new Error(`Shipment item quantity must be greater than 0. Received ${newItem.quantity}`);
      }

      const orderItem = (orderItems || []).find((i: any) => i._id.toString() === newItem.orderItemId || i.id === newItem.orderItemId);
      const totalOrdered = orderItem ? orderItem.quantity : 0;
      const alreadyShipped = shippedQtyMap[newItem.orderItemId] || 0;

      if (alreadyShipped + newItem.quantity > totalOrdered) {
        throw new Error(`Cannot ship quantity ${newItem.quantity}. Order item ${newItem.orderItemId} ordered ${totalOrdered}, already shipped ${alreadyShipped}.`);
      }
    }

    const shipmentNumber = await ShipmentNumberService.generateShipmentNumber(tenantId);
    const courierResult = await this.mockProvider.createShipment({ orderId, shipmentNumber });

    const shipment = new ShipmentModel({
      tenantId,
      shipmentNumber,
      orderId,
      fulfillmentId,
      customerId: order.customerId,
      courierId,
      courierName,
      trackingNumber: courierResult.trackingNumber,
      trackingUrl: courierResult.trackingUrl,
      labelUrl: courierResult.labelUrl,
      estimatedDeliveryAt: courierResult.estimatedDeliveryAt,
      status: ShipmentStatus.READY,
      packageCount,
      codAmountMinor,
      shippingCostMinor,
      createdBy
    });

    await shipment.save();

    for (const newItem of items) {
      const sItem = new ShipmentItemModel({
        tenantId,
        shipmentId: shipment._id.toString(),
        orderId,
        orderItemId: newItem.orderItemId,
        productId: newItem.productId,
        variantId: newItem.variantId,
        quantity: newItem.quantity,
        unitPriceMinor: newItem.unitPriceMinor || 0,
        vendorCostMinor: newItem.vendorCostMinor || 0,
        currency: order.currency || 'PKR'
      });
      await sItem.save();
    }

    // Append initial tracking event
    await ShipmentTrackingEventModel.create({
      tenantId,
      shipmentId: shipment._id.toString(),
      eventId: `evt_${Date.now()}`,
      eventType: 'SHIPMENT_CREATED',
      status: ShipmentStatus.READY,
      description: 'Shipment created and ready for pickup',
      source: 'SYSTEM',
      eventAt: new Date()
    });

    return shipment;
  }

  static async updateShipmentStatus(
    tenantId: string,
    shipmentId: string,
    nextStatus: ShipmentStatus,
    carrierStatus?: string,
    location?: string,
    description?: string,
    source: 'COURIER' | 'SYSTEM' | 'MANUAL' = 'SYSTEM'
  ): Promise<IShipmentDocument> {
    const shipment = await ShipmentModel.findOne({ _id: shipmentId, tenantId });
    if (!shipment) {
      throw new Error(`Shipment not found for ID ${shipmentId}`);
    }

    ShipmentStateMachine.validateTransition(shipment.status, nextStatus);

    shipment.status = nextStatus;
    if (carrierStatus) shipment.carrierStatus = carrierStatus;

    const now = new Date();
    if (nextStatus === ShipmentStatus.PICKED_UP) shipment.pickedUpAt = now;
    if (nextStatus === ShipmentStatus.IN_TRANSIT) shipment.inTransitAt = now;
    if (nextStatus === ShipmentStatus.OUT_FOR_DELIVERY) shipment.outForDeliveryAt = now;
    if (nextStatus === ShipmentStatus.DELIVERED) shipment.deliveredAt = now;
    if (nextStatus === ShipmentStatus.DELIVERY_FAILED) shipment.failedAt = now;
    if (nextStatus === ShipmentStatus.RTO_DELIVERED) shipment.returnedAt = now;

    await shipment.save();

    // Append immutable tracking event
    await ShipmentTrackingEventModel.create({
      tenantId,
      shipmentId,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      eventType: `STATUS_${nextStatus}`,
      status: nextStatus,
      carrierStatus,
      location,
      description: description || `Shipment transitioned to ${nextStatus}`,
      source,
      eventAt: now
    });

    return shipment;
  }

  static async cancelShipment(tenantId: string, shipmentId: string, reason?: string): Promise<IShipmentDocument> {
    return this.updateShipmentStatus(tenantId, shipmentId, ShipmentStatus.CANCELLED, undefined, undefined, reason || 'Shipment cancelled by user', 'MANUAL');
  }

  static async createException(
    tenantId: string,
    shipmentId: string,
    type: ShipmentExceptionType,
    description: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ) {
    const exception = new ShipmentExceptionModel({
      tenantId,
      shipmentId,
      type,
      severity,
      status: 'OPEN',
      description
    });
    await exception.save();
    return exception;
  }
}
