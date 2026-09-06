import { CustomerReturnModel, ICustomerReturnDocument } from '../models/CustomerReturn';
import { CustomerReturnItemModel, ICustomerReturnItemDocument } from '../models/CustomerReturnItem';
import { ReturnInspectionModel } from '../models/ReturnInspection';
import { OrderModel } from '../models/Order';
import { OrderItemModel } from '../models/OrderItem';
import { InventoryModel } from '../models/Inventory';
import { InventoryMovementModel } from '../models/InventoryMovement';
import { RefundService } from './refund.service';
import { ShipmentNumberService } from './shipment-number.service';
import { ReturnStateMachine } from './shipment-state-machine';
import { CustomerReturnStatus, ReturnItemCondition, ReturnItemDecision } from '@sellzy/shared';

export interface IRequestReturnParams {
  tenantId: string;
  orderId: string;
  customerId: string;
  reason: string;
  customerNotes?: string;
  items: {
    orderItemId: string;
    productId: string;
    variantId?: string;
    requestedQuantity: number;
    reason: string;
  }[];
}

export class ReturnService {
  static async requestReturn(params: IRequestReturnParams): Promise<ICustomerReturnDocument> {
    const { tenantId, orderId, customerId, reason, customerNotes, items } = params;

    const order = await OrderModel.findOne({ _id: orderId, tenantId });
    if (!order) {
      throw new Error(`Order not found for ID ${orderId}`);
    }

    if (order.customerId !== customerId) {
      throw new Error('Order does not belong to customer.');
    }

    const orderItems = await OrderItemModel.find({ tenantId, orderId });

    // Validate return quantity limit against existing return requests for this order
    const neStatus = { $ne: CustomerReturnStatus.REJECTED };
    const existingReturns = await CustomerReturnModel.find({ tenantId, orderId, status: neStatus });
    const existingReturnIds = existingReturns.map(r => r._id.toString());
    const inIds = { $in: existingReturnIds };
    const existingItems = await CustomerReturnItemModel.find({ returnId: inIds });

    const returnedQtyMap: Record<string, number> = {};
    for (const ei of existingItems) {
      returnedQtyMap[ei.orderItemId] = (returnedQtyMap[ei.orderItemId] || 0) + ei.requestedQuantity;
    }

    for (const newItem of items) {
      const orderItem = (orderItems || []).find((i: any) => i._id.toString() === newItem.orderItemId || i.id === newItem.orderItemId);
      const purchased = orderItem ? orderItem.quantity : 0;
      const alreadyReturned = returnedQtyMap[newItem.orderItemId] || 0;

      if (alreadyReturned + newItem.requestedQuantity > purchased) {
        throw new Error(`Cannot request return quantity ${newItem.requestedQuantity}. Purchased ${purchased}, already requested return ${alreadyReturned}.`);
      }
    }

    const returnNumber = await ShipmentNumberService.generateReturnNumber(tenantId);

    const customerReturn = new CustomerReturnModel({
      tenantId,
      returnNumber,
      orderId,
      customerId,
      status: CustomerReturnStatus.REQUESTED,
      reason,
      customerNotes,
      requestedAt: new Date()
    });

    await customerReturn.save();

    for (const item of items) {
      const returnItem = new CustomerReturnItemModel({
        returnId: customerReturn._id.toString(),
        orderItemId: item.orderItemId,
        productId: item.productId,
        variantId: item.variantId,
        requestedQuantity: item.requestedQuantity,
        receivedQuantity: 0,
        approvedQuantity: 0,
        rejectedQuantity: 0,
        reason: item.reason
      });
      await returnItem.save();
    }

    return customerReturn;
  }

  static async approveReturn(tenantId: string, returnId: string, approvedBy: string): Promise<ICustomerReturnDocument> {
    const customerReturn = await CustomerReturnModel.findOne({ _id: returnId, tenantId });
    if (!customerReturn) {
      throw new Error(`Customer return not found for ID ${returnId}`);
    }

    ReturnStateMachine.validateTransition(customerReturn.status as CustomerReturnStatus, CustomerReturnStatus.APPROVED);

    customerReturn.status = CustomerReturnStatus.APPROVED;
    customerReturn.approvedAt = new Date();
    await customerReturn.save();
    return customerReturn;
  }

  static async inspectAndReceiveReturn(
    tenantId: string,
    returnId: string,
    inspections: {
      itemId: string;
      condition: ReturnItemCondition;
      decision: ReturnItemDecision;
      approvedQuantity: number;
      notes?: string;
    }[],
    inspectedBy: string
  ): Promise<ICustomerReturnDocument> {
    const customerReturn = await CustomerReturnModel.findOne({ _id: returnId, tenantId });
    if (!customerReturn) {
      throw new Error(`Customer return not found for ID ${returnId}`);
    }

    for (const insp of inspections) {
      if (
        insp.approvedQuantity === undefined ||
        insp.approvedQuantity === null ||
        typeof insp.approvedQuantity !== 'number' ||
        isNaN(insp.approvedQuantity) ||
        !isFinite(insp.approvedQuantity) ||
        insp.approvedQuantity < 0 ||
        !Number.isInteger(insp.approvedQuantity)
      ) {
        throw new Error(`Invalid approved quantity: ${insp.approvedQuantity}`);
      }

      const returnItem = await CustomerReturnItemModel.findOne({ returnId, _id: insp.itemId });
      if (returnItem) {
        if (insp.approvedQuantity > returnItem.requestedQuantity) {
          throw new Error(`Approved quantity ${insp.approvedQuantity} cannot exceed requested quantity ${returnItem.requestedQuantity}`);
        }

        returnItem.condition = insp.condition;
        returnItem.approvedQuantity = insp.approvedQuantity;
        returnItem.receivedQuantity = returnItem.requestedQuantity;
        if (insp.decision === ReturnItemDecision.REJECT) {
          returnItem.rejectedQuantity = returnItem.requestedQuantity - insp.approvedQuantity;
        }
        await returnItem.save();

        await ReturnInspectionModel.create({
          tenantId,
          returnId,
          itemId: insp.itemId,
          condition: insp.condition,
          decision: insp.decision,
          notes: insp.notes,
          inspectedBy,
          inspectedAt: new Date()
        });

        // Inventory Restock iff SEALED or ACCEPTED sellable stock
        if (insp.decision === ReturnItemDecision.ACCEPT && insp.condition === ReturnItemCondition.SEALED) {
          const inv = await InventoryModel.findOne({ tenantId, productId: returnItem.productId });
          if (inv) {
            const previousQty = inv.quantityOnHand;
            inv.quantityOnHand += insp.approvedQuantity;
            inv.quantityAvailable += insp.approvedQuantity;
            await inv.save();

            await InventoryMovementModel.create({
              tenantId,
              inventoryId: inv._id.toString(),
              productId: returnItem.productId,
              variantId: returnItem.variantId,
              locationId: inv.locationId,
              type: 'RETURN_RESTOCK',
              quantity: insp.approvedQuantity,
              previousQuantityOnHand: previousQty,
              newQuantityOnHand: inv.quantityOnHand,
              referenceType: 'CUSTOMER_RETURN',
              referenceId: returnId,
              createdBy: inspectedBy
            });
          }
        }
      }
    }

    if (customerReturn.status !== CustomerReturnStatus.APPROVED_FOR_REFUND) {
      ReturnStateMachine.validateTransition(customerReturn.status as CustomerReturnStatus, CustomerReturnStatus.APPROVED_FOR_REFUND);
    }
    customerReturn.status = CustomerReturnStatus.APPROVED_FOR_REFUND;
    customerReturn.receivedAt = new Date();
    await customerReturn.save();
    return customerReturn;
  }
}
