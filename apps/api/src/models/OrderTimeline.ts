import mongoose, { Schema, Document } from 'mongoose';
import { IOrderTimeline } from '@sellzy/shared';

export interface IOrderTimelineDocument extends Omit<IOrderTimeline, 'id'>, Document {}

const OrderTimelineSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    event: { type: String, required: true },
    actorUserId: { type: String },
    source: { type: String, required: true, default: 'SYSTEM' },
    metadata: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

OrderTimelineSchema.index({ tenantId: 1, orderId: 1, createdAt: 1 });

export const OrderTimelineModel = mongoose.model<IOrderTimelineDocument>('OrderTimeline', OrderTimelineSchema);
