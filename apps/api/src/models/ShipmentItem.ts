import mongoose, { Schema, Document } from 'mongoose';
import { IShipmentItem } from '@sellzy/shared';

export interface IShipmentItemDocument extends Omit<IShipmentItem, 'id'>, Document {}

const ShipmentItemSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    shipmentId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    orderItemId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    variantId: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPriceMinor: { type: Number, required: true, default: 0 },
    vendorCostMinor: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'PKR' }
  },
  {
    timestamps: true
  }
);

ShipmentItemSchema.index({ tenantId: 1, shipmentId: 1 });
ShipmentItemSchema.index({ tenantId: 1, orderId: 1, orderItemId: 1 });

export const ShipmentItemModel = mongoose.model<IShipmentItemDocument>('ShipmentItem', ShipmentItemSchema);
