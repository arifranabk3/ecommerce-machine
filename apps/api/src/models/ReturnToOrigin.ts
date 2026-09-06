import mongoose, { Schema, Document } from 'mongoose';
import { IReturnToOrigin, RTOStatus } from '@sellzy/shared';

export interface IReturnToOriginDocument extends Omit<IReturnToOrigin, 'id'>, Document {}

const ReturnToOriginSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    rtoNumber: { type: String, required: true, index: true },
    shipmentId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    vendorId: { type: String, index: true },
    reason: { type: String, required: true },
    attemptCount: { type: Number, required: true, default: 1 },
    status: { type: String, enum: Object.values(RTOStatus), default: RTOStatus.INITIATED, required: true, index: true },
    rtoCostMinor: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'PKR' },
    initiatedAt: { type: Date, required: true, default: Date.now },
    deliveredAt: { type: Date },
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

ReturnToOriginSchema.index({ tenantId: 1, rtoNumber: 1 }, { unique: true });
ReturnToOriginSchema.index({ tenantId: 1, shipmentId: 1 }, { unique: true });

export const ReturnToOriginModel = mongoose.model<IReturnToOriginDocument>('ReturnToOrigin', ReturnToOriginSchema);
