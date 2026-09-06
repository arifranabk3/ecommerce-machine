import mongoose, { Schema, Document } from 'mongoose';
import { IPurchaseOrderItem } from '@sellzy/shared';

export interface IPurchaseOrderItemDocument extends Omit<IPurchaseOrderItem, 'id'>, Document {}

const PurchaseOrderItemSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    purchaseOrderId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    variantId: { type: String, index: true },
    productNameSnapshot: { type: String, required: true },
    variantNameSnapshot: { type: String },
    skuSnapshot: { type: String, required: true },
    supplierSKUSnapshot: { type: String, required: true },
    orderedQuantity: { type: Number, required: true, min: 1 },
    receivedQuantity: { type: Number, required: true, default: 0, min: 0 },
    unitCostMinor: { type: Number, required: true, min: 0 },
    totalCostMinor: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: true
  }
);

PurchaseOrderItemSchema.index({ tenantId: 1, purchaseOrderId: 1 });
PurchaseOrderItemSchema.index({ tenantId: 1, productId: 1 });

export const PurchaseOrderItemModel = mongoose.model<IPurchaseOrderItemDocument>('PurchaseOrderItem', PurchaseOrderItemSchema);
