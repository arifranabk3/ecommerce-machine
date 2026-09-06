import mongoose, { Schema, Document } from 'mongoose';
import { ICustomerReturnItem, ReturnItemCondition } from '@sellzy/shared';

export interface ICustomerReturnItemDocument extends Omit<ICustomerReturnItem, 'id'>, Document {}

const CustomerReturnItemSchema: Schema = new Schema(
  {
    returnId: { type: String, required: true, index: true },
    orderItemId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    variantId: { type: String },
    requestedQuantity: { type: Number, required: true, min: 1 },
    receivedQuantity: { type: Number, required: true, default: 0 },
    approvedQuantity: { type: Number, required: true, default: 0 },
    rejectedQuantity: { type: Number, required: true, default: 0 },
    reason: { type: String, required: true },
    condition: { type: String, enum: Object.values(ReturnItemCondition) },
    resolution: { type: String, enum: ['REFUND', 'REPLACEMENT', 'STORE_CREDIT', 'REJECT'], default: 'REFUND' }
  },
  {
    timestamps: true
  }
);

CustomerReturnItemSchema.index({ returnId: 1, orderItemId: 1 });

export const CustomerReturnItemModel = mongoose.model<ICustomerReturnItemDocument>(
  'CustomerReturnItem',
  CustomerReturnItemSchema
);
