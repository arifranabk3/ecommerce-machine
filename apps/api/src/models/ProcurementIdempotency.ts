import mongoose, { Schema, Document } from 'mongoose';

export interface IProcurementIdempotencyDocument extends Document {
  tenantId: string;
  idempotencyKey: string;
  purchaseOrderId: string;
  requestHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProcurementIdempotencySchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    idempotencyKey: { type: String, required: true },
    purchaseOrderId: { type: String, required: true },
    requestHash: { type: String }
  },
  {
    timestamps: true
  }
);

ProcurementIdempotencySchema.index({ tenantId: 1, idempotencyKey: 1 }, { unique: true });

export const ProcurementIdempotencyModel = mongoose.model<IProcurementIdempotencyDocument>('ProcurementIdempotency', ProcurementIdempotencySchema);
