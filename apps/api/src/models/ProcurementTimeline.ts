import mongoose, { Schema, Document } from 'mongoose';
import { IProcurementTimeline } from '@sellzy/shared';

export interface IProcurementTimelineDocument extends Omit<IProcurementTimeline, 'id'>, Document {}

const ProcurementTimelineSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    purchaseOrderId: { type: String, required: true, index: true },
    action: { type: String, required: true, trim: true },
    actorUserId: { type: String, required: true },
    actorName: { type: String, required: true },
    fromStatus: { type: String },
    toStatus: { type: String },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
);

ProcurementTimelineSchema.index({ tenantId: 1, purchaseOrderId: 1, createdAt: -1 });

export const ProcurementTimelineModel = mongoose.model<IProcurementTimelineDocument>('ProcurementTimeline', ProcurementTimelineSchema);
