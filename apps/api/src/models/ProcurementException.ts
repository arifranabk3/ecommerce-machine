import mongoose, { Schema, Document } from 'mongoose';
import { IProcurementException, ProcurementExceptionReason } from '@sellzy/shared';

export interface IProcurementExceptionDocument extends Omit<IProcurementException, 'id'>, Document {}

const ProcurementExceptionSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    purchaseOrderId: { type: String, index: true },
    salesOrderId: { type: String, index: true },
    vendorId: { type: String, index: true },
    productId: { type: String, index: true },
    variantId: { type: String, index: true },
    reason: {
      type: String,
      enum: Object.values(ProcurementExceptionReason),
      required: true,
      index: true
    },
    message: { type: String, required: true },
    resolved: { type: Boolean, required: true, default: false, index: true },
    resolvedBy: { type: String },
    resolvedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

ProcurementExceptionSchema.index({ tenantId: 1, resolved: 1, createdAt: -1 });

export const ProcurementExceptionModel = mongoose.model<IProcurementExceptionDocument>('ProcurementException', ProcurementExceptionSchema);
