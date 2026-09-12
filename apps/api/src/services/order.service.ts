import { OrderModel, IOrderDocument } from '../models/Order';
import { OrderItemModel } from '../models/OrderItem';
import { OrderTimelineModel } from '../models/OrderTimeline';
import { OrderNoteModel } from '../models/OrderNote';
import { OrderIdempotencyModel } from '../models/OrderIdempotency';
import { ProductModel } from '../models/Product';
import { ProductVariantModel } from '../models/ProductVariant';
import { InventoryReservationModel } from '../models/InventoryReservation';
import { InventoryService } from './inventory.service';
import { OrderNumberService } from './order-number.service';
import { OrderStateMachine } from './order-state-machine';
import { SecurityService } from './security.service';
import { emitTenantEvent } from '../events/emitter';
import { AppError } from '../middleware/error';
import { CustomerService } from './customer.service';
import { createOrderSchema, updateOrderSchema, orderTransitionSchema, createOrderNoteSchema, CreateOrderInput, UpdateOrderInput, OrderTransitionInput, CreateOrderNoteInput } from '@sellzy/validation';
import { OrderStatus, PaymentStatus, FulfillmentStatus, ReservationStatus, SystemEvents } from '@sellzy/shared';

export interface OrderFilterOptions {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  source?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export class OrderService {
  /**
   * Creates a new sales order with historical item snapshots, server-side pricing,
   * idempotency protection, and atomic inventory reservation.
   */
  static async createOrder(
    tenantId: string,
    rawInput: any,
    actorUserId?: string
  ): Promise<{ order: IOrderDocument; items: any[] }> {
    const input: CreateOrderInput = createOrderSchema.parse(rawInput);
    // 1. Check Idempotency Key
    if (input.idempotencyKey) {
      const existingIdempotency = await OrderIdempotencyModel.findOne({
        tenantId,
        operation: 'CREATE_ORDER',
        idempotencyKey: input.idempotencyKey
      });

      if (existingIdempotency) {
        const order = await OrderModel.findOne({ tenantId, _id: existingIdempotency.orderId });
        const items = await OrderItemModel.find({ tenantId, orderId: existingIdempotency.orderId });
        if (order) {
          return { order, items };
        }
      }
    }

    // 2. Check External Order Deduplication
    if (input.externalOrderId) {
      const existingExternal = await OrderModel.findOne({
        tenantId,
        source: input.source,
        externalOrderId: input.externalOrderId
      });
      if (existingExternal) {
        const items = await OrderItemModel.find({ tenantId, orderId: existingExternal._id });
        return { order: existingExternal, items };
      }
    }

    // 3. Validate Line Items & Build Snapshots
    let calculatedSubtotalMinor = 0;
    const resolvedItems: any[] = [];
    const reservationRecords: { productId: string; variantId?: string; quantity: number }[] = [];

    for (const itemInput of input.items) {
      const product = await ProductModel.findOne({ tenantId, _id: itemInput.productId, isArchived: false });
      if (!product) {
        throw new AppError(`Product not found or archived: ${itemInput.productId}`, 404, 'PRODUCT_NOT_FOUND');
      }

      let variant: any = null;
      if (itemInput.variantId) {
        variant = await ProductVariantModel.findOne({
          tenantId,
          productId: itemInput.productId,
          _id: itemInput.variantId,
          isArchived: false
        });
        if (!variant) {
          throw new AppError(`Product variant not found or archived: ${itemInput.variantId}`, 404, 'VARIANT_NOT_FOUND');
        }
      }

      // Server is authoritative for price snapshots from catalog
      const unitPriceMinor = variant ? variant.sellingPrice : product.sellingPrice;

      const unitCostMinor = variant ? (variant.costPrice || product.costPrice) : product.costPrice;
      const lineDiscountMinor = itemInput.discountMinor || 0;
      const lineTaxMinor = itemInput.taxMinor || 0;

      const rawLineSubtotal = unitPriceMinor * itemInput.quantity;
      const lineSubtotalMinor = Math.max(0, rawLineSubtotal - lineDiscountMinor);
      const lineTotalMinor = lineSubtotalMinor + lineTaxMinor;

      calculatedSubtotalMinor += lineSubtotalMinor;

      resolvedItems.push({
        productId: product._id.toString(),
        variantId: variant ? variant._id.toString() : undefined,
        productNameSnapshot: product.name,
        variantNameSnapshot: variant ? variant.name : undefined,
        skuSnapshot: variant ? variant.sku : product.sku,
        barcodeSnapshot: variant ? variant.barcode : product.barcode,
        quantity: itemInput.quantity,
        unitPriceMinor,
        unitCostMinor,
        discountMinor: lineDiscountMinor,
        taxMinor: lineTaxMinor,
        lineSubtotalMinor,
        lineTotalMinor
      });

      reservationRecords.push({
        productId: product._id.toString(),
        variantId: variant ? variant._id.toString() : undefined,
        quantity: itemInput.quantity
      });
    }

    // 4. Calculate Server Totals
    const discountMinor = input.discountMinor || 0;
    const shippingMinor = input.shippingMinor || 0;
    const taxMinor = input.taxMinor || 0;

    const totalMinor = Math.max(0, calculatedSubtotalMinor - discountMinor + shippingMinor + taxMinor);

    // Initial Payment & Fulfillment Statuses
    const paymentStatus = input.paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.UNPAID;
    const amountPaidMinor = 0;
    const amountDueMinor = totalMinor;

    // 5. Generate Order Number
    const { orderNumber, normalizedOrderNumber } = await OrderNumberService.generateOrderNumber(tenantId);

    // 6. Reserve Inventory for Each Item
    const createdReservations: any[] = [];
    try {
      for (const resItem of reservationRecords) {
        const reservation = await InventoryService.reserveStock(
          tenantId,
          {
            productId: resItem.productId,
            variantId: resItem.variantId,
            warehouseId: (input as any).locationId,
            quantity: resItem.quantity,
            referenceType: 'ORDER',
            referenceId: normalizedOrderNumber,
            ttlSeconds: 86400 * 30 // 30-day order hold
          },
          actorUserId
        );
        createdReservations.push(reservation);
      }
    } catch (resErr) {
      // Rollback created reservations if any fail
      for (const res of createdReservations) {
        try {
          await InventoryService.releaseReservation(tenantId, res._id.toString(), actorUserId);
        } catch (_) {}
      }
      throw resErr;
    }

    // 7. Persist Order Record
    const order = await OrderModel.create({
      tenantId,
      orderNumber,
      normalizedOrderNumber,
      status: OrderStatus.PENDING,
      paymentStatus,
      fulfillmentStatus: FulfillmentStatus.PENDING,
      source: input.source,
      channel: input.channel,
      paymentMethod: input.paymentMethod,
      externalOrderId: input.externalOrderId,
      customerId: input.customerId,
      customerSnapshot: input.customerSnapshot,
      billingAddressSnapshot: input.billingAddressSnapshot,
      shippingAddressSnapshot: input.shippingAddressSnapshot,
      currency: input.currency || 'USD',
      subtotalMinor: calculatedSubtotalMinor,
      discountMinor,
      shippingMinor,
      taxMinor,
      totalMinor,
      amountPaidMinor,
      amountDueMinor,
      itemCount: resolvedItems.reduce((acc, i) => acc + i.quantity, 0),
      notes: input.notes,
      metadata: input.metadata,
      createdBy: actorUserId,
      updatedBy: actorUserId
    });

    // 8. Create Order Items
    const itemsToCreate = resolvedItems.map(i => ({
      ...i,
      orderId: order._id.toString(),
      tenantId
    }));
    const createdItems = await OrderItemModel.insertMany(itemsToCreate);

    // 9. Link Reservations to Actual Order ID
    await InventoryReservationModel.updateMany(
      { tenantId, referenceId: normalizedOrderNumber },
      { $set: { referenceId: order._id.toString() } }
    );

    // 10. Record Timeline Event
    await OrderTimelineModel.create({
      tenantId,
      orderId: order._id.toString(),
      event: 'ORDER_CREATED',
      actorUserId,
      source: input.source,
      metadata: { orderNumber, totalMinor }
    });

    // 11. Recalculate Customer metrics if customerId present
    if (order.customerId) {
      CustomerService.recalculateMetrics(tenantId, order.customerId).catch(() => {});
    }

    // 12. Security Audit & Socket.IO Emission
    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.ORDER_CREATED,
        resourceType: 'Order',
        resourceId: order._id.toString(),
        after: { orderNumber, totalMinor },
        source: 'API',
        result: 'SUCCESS'
      });
    }

    emitTenantEvent(tenantId, SystemEvents.ORDER_CREATED, {
      orderId: order._id.toString(),
      orderNumber,
      status: order.status,
      totalMinor
    });

    // 12. Save Idempotency Record
    if (input.idempotencyKey) {
      await OrderIdempotencyModel.create({
        tenantId,
        operation: 'CREATE_ORDER',
        idempotencyKey: input.idempotencyKey,
        orderId: order._id.toString(),
        responseData: { orderId: order._id.toString(), orderNumber }
      });
    }

    return { order, items: createdItems };
  }

  /**
   * Retrieves a single order within a tenant by ID.
   */
  static async getOrderById(tenantId: string, orderId: string): Promise<{ order: IOrderDocument; items: any[]; timeline: any[]; notes: any[] }> {
    const order = await OrderModel.findOne({ tenantId, _id: orderId });
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    const [items, timeline, notes] = await Promise.all([
      OrderItemModel.find({ tenantId, orderId }),
      OrderTimelineModel.find({ tenantId, orderId }).sort({ createdAt: 1 }),
      OrderNoteModel.find({ tenantId, orderId }).sort({ createdAt: -1 })
    ]);

    return { order, items, timeline, notes };
  }

  /**
   * Lists orders within a tenant with pagination and multi-field filtering.
   */
  static async listOrders(
    tenantId: string,
    options: OrderFilterOptions = {}
  ): Promise<{ items: IOrderDocument[]; total: number; page: number; limit: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = { tenantId };

    if (options.status) query.status = options.status;
    if (options.paymentStatus) query.paymentStatus = options.paymentStatus;
    if (options.fulfillmentStatus) query.fulfillmentStatus = options.fulfillmentStatus;
    if (options.source) query.source = options.source;

    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    if (options.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customerSnapshot.name': searchRegex },
        { 'customerSnapshot.phone': searchRegex },
        { 'customerSnapshot.email': searchRegex }
      ];
    }

    const [items, total] = await Promise.all([
      OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(query)
    ]);

    return { items, total, page, limit };
  }

  /**
   * Transitions an order status via the OrderStateMachine.
   */
  static async transitionOrderStatus(
    tenantId: string,
    orderId: string,
    targetStatus: OrderStatus,
    reason?: string,
    actorUserId?: string
  ): Promise<IOrderDocument> {
    const order = await OrderModel.findOne({ tenantId, _id: orderId });
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    OrderStateMachine.validateTransition(order.status, targetStatus);

    const oldStatus = order.status;
    order.status = targetStatus;
    order.updatedBy = actorUserId;

    if (targetStatus === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();

      // Release active stock reservations upon cancellation
      const reservations = await InventoryReservationModel.find({
        tenantId,
        referenceId: orderId,
        status: ReservationStatus.ACTIVE
      });

      for (const res of reservations) {
        await InventoryService.releaseReservation(tenantId, res._id.toString(), actorUserId);
      }
    } else if (targetStatus === OrderStatus.DELIVERED) {
      order.completedAt = new Date();
      order.fulfillmentStatus = FulfillmentStatus.DELIVERED;
    }

    await order.save();

    // Record Timeline
    await OrderTimelineModel.create({
      tenantId,
      orderId,
      event: `STATUS_CHANGED_${targetStatus}`,
      actorUserId,
      source: 'API',
      metadata: { oldStatus, newStatus: targetStatus, reason }
    });

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.ORDER_STATUS_CHANGED,
        resourceType: 'Order',
        resourceId: orderId,
        before: { status: oldStatus },
        after: { status: targetStatus, reason },
        source: 'API',
        result: 'SUCCESS'
      });
    }

    emitTenantEvent(tenantId, SystemEvents.ORDER_STATUS_CHANGED, {
      orderId,
      orderNumber: order.orderNumber,
      oldStatus,
      newStatus: targetStatus
    });

    return order;
  }

  /**
   * Adds an internal note to an order.
   */
  static async addOrderNote(
    tenantId: string,
    orderId: string,
    input: CreateOrderNoteInput,
    authorUserId: string
  ): Promise<any> {
    const order = await OrderModel.findOne({ tenantId, _id: orderId });
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    const note = await OrderNoteModel.create({
      tenantId,
      orderId,
      authorUserId,
      content: input.content
    });

    await OrderTimelineModel.create({
      tenantId,
      orderId,
      event: 'NOTE_ADDED',
      actorUserId: authorUserId,
      source: 'API',
      metadata: { noteId: note._id.toString() }
    });

    return note;
  }

  /**
   * Updates basic order metadata/address before processing.
   */
  static async updateOrder(
    tenantId: string,
    orderId: string,
    input: UpdateOrderInput,
    actorUserId?: string
  ): Promise<IOrderDocument> {
    const order = await OrderModel.findOne({ tenantId, _id: orderId });
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new AppError('Cannot update completed or cancelled order', 400, 'ORDER_LOCKED');
    }

    if (input.customerSnapshot) order.customerSnapshot = { ...order.customerSnapshot, ...input.customerSnapshot };
    if (input.billingAddressSnapshot) order.billingAddressSnapshot = input.billingAddressSnapshot;
    if (input.shippingAddressSnapshot) order.shippingAddressSnapshot = input.shippingAddressSnapshot;
    if (input.notes !== undefined) order.notes = input.notes;
    if (input.metadata !== undefined) order.metadata = input.metadata;

    order.updatedBy = actorUserId;
    await order.save();

    return order;
  }
}
