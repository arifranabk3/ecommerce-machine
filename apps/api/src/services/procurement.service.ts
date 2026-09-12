import { PurchaseOrderModel } from '../models/PurchaseOrder';
import { PurchaseOrderItemModel } from '../models/PurchaseOrderItem';
import { ProcurementTimelineModel } from '../models/ProcurementTimeline';
import { ProcurementExceptionModel } from '../models/ProcurementException';
import { ProcurementIdempotencyModel } from '../models/ProcurementIdempotency';
import { VendorModel } from '../models/Vendor';
import { VendorProductModel } from '../models/VendorProduct';
import { ProductModel } from '../models/Product';
import { ProductVariantModel } from '../models/ProductVariant';
import { WarehouseModel } from '../models/Warehouse';
import { InventoryModel } from '../models/Inventory';
import { InventoryMovementModel } from '../models/InventoryMovement';
import { OrderModel } from '../models/Order';
import { OrderItemModel } from '../models/OrderItem';
import { VendorNumberService } from './vendor-number.service';
import { SupplierSelectionService } from './supplier-selection.service';
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from '@sellzy/validation';
import { PurchaseOrderStatus, PurchaseOrderSource, ProcurementExceptionReason, InventoryMovementType } from '@sellzy/shared';

export class ProcurementService {
  /**
   * Create a new Purchase Order with server-authoritative integer minor units totals.
   */
  static async createPurchaseOrder(tenantId: string, input: CreatePurchaseOrderInput, actorUserId: string, actorName: string) {
    if (input.idempotencyKey) {
      const existing = await ProcurementIdempotencyModel.findOne({ tenantId, idempotencyKey: input.idempotencyKey }).exec();
      if (existing) {
        const po = await PurchaseOrderModel.findOne({ tenantId, _id: existing.purchaseOrderId }).exec();
        if (po) return po;
      }
    }

    const vendor = (await VendorModel.findOne({ tenantId, _id: input.vendorId }).exec()) as any;
    if (!vendor) throw new Error('Vendor not found');

    const location = await WarehouseModel.findOne({ tenantId, _id: input.destinationLocationId }).exec();
    if (!location) throw new Error('Destination location not found');

    const { poNumber, normalizedPoNumber } = await VendorNumberService.generatePoNumber(tenantId);

    // Validate and process items
    let subtotalMinor = 0;
    let itemCount = 0;
    const processedItems: any[] = [];

    for (const itemInput of input.items) {
      const product = (await ProductModel.findOne({ tenantId, _id: itemInput.productId }).exec()) as any;
      if (!product) throw new Error(`Product ${itemInput.productId} not found`);

      let variantName = '';
      let sku = product.sku;
      if (itemInput.variantId) {
        const variant = (await ProductVariantModel.findOne({ tenantId, _id: itemInput.variantId, productId: itemInput.productId }).exec()) as any;
        if (!variant) throw new Error(`Variant ${itemInput.variantId} not found`);
        variantName = variant.name;
        sku = variant.sku;
      }

      // Lookup supplier SKU if not provided
      let supplierSKU = itemInput.supplierSKU;
      if (!supplierSKU) {
        const vp = await VendorProductModel.findOne({
          tenantId,
          vendorId: input.vendorId,
          productId: itemInput.productId,
          variantId: itemInput.variantId || null
        }).exec();
        supplierSKU = vp?.supplierSKU || sku;
      }

      const totalCostMinor = itemInput.quantity * itemInput.unitCostMinor;
      subtotalMinor += totalCostMinor;
      itemCount += itemInput.quantity;

      processedItems.push({
        tenantId,
        productId: itemInput.productId,
        variantId: itemInput.variantId || undefined,
        productNameSnapshot: product.name,
        variantNameSnapshot: variantName || undefined,
        skuSnapshot: sku,
        supplierSKUSnapshot: supplierSKU,
        orderedQuantity: itemInput.quantity,
        receivedQuantity: 0,
        unitCostMinor: itemInput.unitCostMinor,
        totalCostMinor
      });
    }

    const taxCostMinor = input.taxCostMinor || 0;
    const shippingCostMinor = input.shippingCostMinor || 0;
    const totalMinor = subtotalMinor + taxCostMinor + shippingCostMinor;

    const purchaseOrder = await PurchaseOrderModel.create({
      tenantId,
      poNumber,
      normalizedPoNumber,
      vendorId: input.vendorId,
      vendorNameSnapshot: vendor.name,
      destinationLocationId: input.destinationLocationId,
      status: PurchaseOrderStatus.DRAFT,
      source: input.source,
      salesOrderId: input.salesOrderId || undefined,
      currency: input.currency,
      subtotalMinor,
      taxCostMinor,
      shippingCostMinor,
      totalMinor,
      itemCount,
      expectedDeliveryDate: input.expectedDeliveryDate ? new Date(input.expectedDeliveryDate) : undefined,
      notes: input.notes,
      createdBy: actorUserId,
      updatedBy: actorUserId
    });

    const poItemsToCreate = processedItems.map(item => ({
      ...item,
      purchaseOrderId: purchaseOrder._id.toString()
    }));
    await PurchaseOrderItemModel.insertMany(poItemsToCreate);

    await ProcurementTimelineModel.create({
      tenantId,
      purchaseOrderId: purchaseOrder._id.toString(),
      action: 'PO_CREATED',
      actorUserId,
      actorName,
      toStatus: PurchaseOrderStatus.DRAFT,
      reason: 'Purchase order created'
    });

    if (input.idempotencyKey) {
      await ProcurementIdempotencyModel.create({
        tenantId,
        idempotencyKey: input.idempotencyKey,
        purchaseOrderId: purchaseOrder._id.toString()
      });
    }

    return purchaseOrder;
  }

  static async getPurchaseOrders(tenantId: string, queryParams: any) {
    const { search, status, vendorId, salesOrderId, page = 1, limit = 50 } = queryParams;
    const filter: any = { tenantId };

    if (status) filter.status = status;
    if (vendorId) filter.vendorId = vendorId;
    if (salesOrderId) filter.salesOrderId = salesOrderId;
    if (search) {
      filter.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { vendorNameSnapshot: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [purchaseOrders, total] = await Promise.all([
      PurchaseOrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec(),
      PurchaseOrderModel.countDocuments(filter)
    ]);

    return {
      purchaseOrders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  static async getPurchaseOrderById(tenantId: string, poId: string) {
    const purchaseOrder = await PurchaseOrderModel.findOne({ tenantId, _id: poId }).exec();
    if (!purchaseOrder) return null;

    const [items, timeline, exceptions] = await Promise.all([
      PurchaseOrderItemModel.find({ tenantId, purchaseOrderId: poId }).exec(),
      ProcurementTimelineModel.find({ tenantId, purchaseOrderId: poId }).sort({ createdAt: -1 }).exec(),
      ProcurementExceptionModel.find({ tenantId, purchaseOrderId: poId }).sort({ createdAt: -1 }).exec()
    ]);

    return {
      purchaseOrder,
      items,
      timeline,
      exceptions
    };
  }

  /**
   * Transition Purchase Order State Machine safely with audit timeline log.
   */
  static async transitionStatus(tenantId: string, poId: string, targetStatus: PurchaseOrderStatus, actorUserId: string, actorName: string, reason?: string) {
    const po = (await PurchaseOrderModel.findOne({ tenantId, _id: poId }).exec()) as any;
    if (!po) throw new Error('Purchase order not found');

    const fromStatus = po.status;
    if (fromStatus === targetStatus) return po;

    // State machine constraints
    if (fromStatus === PurchaseOrderStatus.CANCELLED || fromStatus === PurchaseOrderStatus.FULFILLED) {
      throw new Error(`Cannot transition purchase order from final state ${fromStatus}`);
    }

    po.status = targetStatus;
    po.updatedBy = actorUserId;

    if (targetStatus === PurchaseOrderStatus.APPROVED) {
      po.approvedBy = actorUserId;
      po.approvedAt = new Date();
    } else if (targetStatus === PurchaseOrderStatus.SUBMITTED) {
      po.submittedAt = new Date();
    } else if (targetStatus === PurchaseOrderStatus.ACKNOWLEDGED) {
      po.acknowledgedAt = new Date();
    } else if (targetStatus === PurchaseOrderStatus.FULFILLED) {
      po.fulfilledAt = new Date();
    } else if (targetStatus === PurchaseOrderStatus.CANCELLED) {
      po.cancelledAt = new Date();
    }

    await po.save();

    await ProcurementTimelineModel.create({
      tenantId,
      purchaseOrderId: po._id.toString(),
      action: `PO_STATUS_${targetStatus}`,
      actorUserId,
      actorName,
      fromStatus,
      toStatus: targetStatus,
      reason
    });

    return po;
  }

  /**
   * Receive goods for a Purchase Order line item and update inventory balance atomically.
   */
  static async receiveGoods(
    tenantId: string,
    poId: string,
    itemId: string,
    receivedQuantity: number,
    actorUserId: string,
    actorName: string
  ) {
    const po = (await PurchaseOrderModel.findOne({ tenantId, _id: poId }).exec()) as any;
    if (!po) throw new Error('Purchase order not found');

    if (po.status !== PurchaseOrderStatus.SUBMITTED && po.status !== PurchaseOrderStatus.ACKNOWLEDGED && po.status !== PurchaseOrderStatus.PARTIALLY_FULFILLED) {
      throw new Error(`Cannot receive goods on PO in status ${po.status}`);
    }

    const item = (await PurchaseOrderItemModel.findOne({ tenantId, _id: itemId, purchaseOrderId: poId }).exec()) as any;
    if (!item) throw new Error('Purchase order line item not found');

    item.receivedQuantity += receivedQuantity;
    await item.save();

    // Increment inventory stock balance
    const invQuery: any = {
      tenantId,
      productId: item.productId,
      locationId: po.destinationLocationId,
      variantId: item.variantId || null
    };

    let inv = (await InventoryModel.findOne(invQuery).exec()) as any;
    if (!inv) {
      inv = await InventoryModel.create({
        tenantId,
        productId: item.productId,
        variantId: item.variantId || undefined,
        locationId: po.destinationLocationId,
        onHandQuantity: receivedQuantity,
        reservedQuantity: 0,
        availableQuantity: receivedQuantity,
        reorderPoint: 5,
        reorderQuantity: 20
      });
    } else {
      inv.onHandQuantity += receivedQuantity;
      inv.availableQuantity += receivedQuantity;
      await inv.save();
    }

    // Log Inventory Movement
    await InventoryMovementModel.create({
      tenantId,
      productId: item.productId,
      variantId: item.variantId || undefined,
      locationId: po.destinationLocationId,
      type: InventoryMovementType.STOCK_RECEIVED,
      quantityDelta: receivedQuantity,
      balanceAfter: inv.onHandQuantity,
      reason: `Received PO ${po.poNumber}`,
      referenceType: 'PURCHASE_ORDER',
      referenceId: po._id.toString(),
      createdBy: actorUserId
    });

    // Check if PO is completely fulfilled
    const allItems = (await PurchaseOrderItemModel.find({ tenantId, purchaseOrderId: poId }).exec()) as any[];
    const allFulfilled = allItems.every(i => i.receivedQuantity >= i.orderedQuantity);

    if (allFulfilled) {
      await this.transitionStatus(tenantId, poId, PurchaseOrderStatus.FULFILLED, actorUserId, actorName, 'All items fully received');
    } else {
      await this.transitionStatus(tenantId, poId, PurchaseOrderStatus.PARTIALLY_FULFILLED, actorUserId, actorName, `Received ${receivedQuantity} units`);
    }

    return { po, item };
  }

  /**
   * Split customer sales order line items by vendor and auto-generate Purchase Orders.
   */
  static async splitOrderToProcurement(tenantId: string, salesOrderId: string, actorUserId: string, actorName: string) {
    const salesOrder = (await OrderModel.findOne({ tenantId, _id: salesOrderId }).exec()) as any;
    if (!salesOrder) throw new Error('Sales order not found');

    const orderItems = (await OrderItemModel.find({ tenantId, orderId: salesOrderId }).exec()) as any[];
    if (!orderItems || orderItems.length === 0) throw new Error('Sales order has no line items');

    const vendorItemsMap = new Map<string, any[]>();

    for (const item of orderItems) {
      const supplierSelection = await SupplierSelectionService.selectSupplierForProduct(
        tenantId,
        item.productId,
        item.variantId,
        salesOrderId
      );

      if (supplierSelection) {
        if (!vendorItemsMap.has(supplierSelection.vendorId)) {
          vendorItemsMap.set(supplierSelection.vendorId, []);
        }

        const quantity = Math.max(item.quantity, supplierSelection.minimumOrderQuantity);

        vendorItemsMap.get(supplierSelection.vendorId)!.push({
          productId: item.productId,
          variantId: item.variantId,
          supplierSKU: supplierSelection.supplierSKU,
          quantity,
          unitCostMinor: supplierSelection.costPriceMinor
        });
      }
    }

    const createdPOs: any[] = [];

    for (const [vendorId, items] of vendorItemsMap.entries()) {
      const po = await this.createPurchaseOrder(
        tenantId,
        {
          vendorId,
          destinationLocationId: salesOrder.shippingAddressSnapshot ? 'default-location' : 'default-location',
          source: PurchaseOrderSource.ORDER_SPLIT,
          salesOrderId,
          currency: salesOrder.currency,
          items,
          shippingCostMinor: 0,
          taxCostMinor: 0,
          notes: `Auto-generated from sales order ${salesOrder.orderNumber}`
        },
        actorUserId,
        actorName
      );
      createdPOs.push(po);
    }

    return createdPOs;
  }

  /**
   * Auto-evaluate low-stock items across warehouses and create reorder Purchase Orders.
   */
  static async evaluateLowStockProcurement(tenantId: string, locationId: string, actorUserId: string, actorName: string) {
    const lowStockInventories = (await InventoryModel.find({
      tenantId,
      locationId,
      $expr: { $lte: ['$availableQuantity', '$reorderPoint'] }
    }).exec()) as any[];

    if (!lowStockInventories || lowStockInventories.length === 0) return [];

    const vendorItemsMap = new Map<string, any[]>();

    for (const inv of lowStockInventories) {
      const supplierSelection = await SupplierSelectionService.selectSupplierForProduct(
        tenantId,
        inv.productId,
        inv.variantId
      );

      if (supplierSelection) {
        if (!vendorItemsMap.has(supplierSelection.vendorId)) {
          vendorItemsMap.set(supplierSelection.vendorId, []);
        }

        const reorderQty = Math.max(inv.reorderQuantity || 10, supplierSelection.minimumOrderQuantity);

        vendorItemsMap.get(supplierSelection.vendorId)!.push({
          productId: inv.productId,
          variantId: inv.variantId,
          supplierSKU: supplierSelection.supplierSKU,
          quantity: reorderQty,
          unitCostMinor: supplierSelection.costPriceMinor
        });
      }
    }

    const createdPOs: any[] = [];

    for (const [vendorId, items] of vendorItemsMap.entries()) {
      const po = await this.createPurchaseOrder(
        tenantId,
        {
          vendorId,
          destinationLocationId: locationId,
          source: PurchaseOrderSource.LOW_STOCK,
          currency: 'USD',
          items,
          shippingCostMinor: 0,
          taxCostMinor: 0,
          notes: `Auto-generated for low-stock reorder at location ${locationId}`
        },
        actorUserId,
        actorName
      );
      createdPOs.push(po);
    }

    return createdPOs;
  }
}
