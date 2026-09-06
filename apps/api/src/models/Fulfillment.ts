import mongoose, { Schema, Document } from 'mongoose';
import { IFulfillment, FulfillmentStatus } from '@sellzy/shared';

export interface IFulfillmentDocument extends Omit<IFulfillment, 'id'>, Document {}

const FulfillmentSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(FulfillmentStatus),
      default: FulfillmentStatus.PENDING,
      required: true,
      index: true
    },
    locationId: { type: String, required: true, index: true },
    trackingNumber: { type: String, trim: true },
    carrierCode: { type: String, trim: true },
    packedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date }
  },
  {
    timestamps: true
  }
);

FulfillmentSchema.index({ tenantId: 1, orderId: 1 });
FulfillmentSchema.index({ tenantId: 1, trackingNumber: 1 }, { sparse: true });

export const FulfillmentModel = mongoose.model<IFulfillmentDocument>('Fulfillment', FulfillmentSchema);
