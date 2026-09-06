import mongoose, { Schema, Document } from 'mongoose';
import { IOrderItem } from '@sellzy/shared';

export interface IOrderItemDocument extends Omit<IOrderItem, 'id'>, Document {}

const OrderItemSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    variantId: { type: String, index: true },
    productNameSnapshot: { type: String, required: true },
    variantNameSnapshot: { type: String },
    skuSnapshot: { type: String, required: true },
    barcodeSnapshot: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPriceMinor: { type: Number, required: true, min: 0 },
    unitCostMinor: { type: Number, required: true, default: 0, min: 0 },
    discountMinor: { type: Number, required: true, default: 0, min: 0 },
    taxMinor: { type: Number, required: true, default: 0, min: 0 },
    lineSubtotalMinor: { type: Number, required: true, min: 0 },
    lineTotalMinor: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

OrderItemSchema.index({ tenantId: 1, orderId: 1 });
OrderItemSchema.index({ tenantId: 1, productId: 1 });
OrderItemSchema.index({ tenantId: 1, variantId: 1 });

export const OrderItemModel = mongoose.model<IOrderItemDocument>('OrderItem', OrderItemSchema);
