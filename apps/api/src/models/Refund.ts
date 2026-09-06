import mongoose, { Schema, Document } from 'mongoose';
import { RefundStatus } from '@sellzy/shared';

export interface IRefundDocument extends Document {
  tenantId: string;
  refundNumber: string;
  paymentId: string;
  orderId: string;
  amountMinor: number;
  currency: string;
  status: RefundStatus;
  providerRefundId?: string;
  reason: string;
  idempotencyKey?: string;
  createdBy?: string;
  approvedBy?: string;
  createdAt: Date;
  processedAt?: Date;
}

const RefundSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    refundNumber: { type: String, required: true },
    paymentId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    amountMinor: { type: Number, required: true },
    currency: { type: String, required: true, default: 'PKR' },
    status: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.REQUESTED,
      required: true,
      index: true
    },
    providerRefundId: { type: String, index: true },
    reason: { type: String, required: true },
    idempotencyKey: { type: String, index: true },
    createdBy: { type: String },
    approvedBy: { type: String },
    processedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

RefundSchema.index({ tenantId: 1, refundNumber: 1 }, { unique: true });
RefundSchema.index({ tenantId: 1, paymentId: 1, createdAt: -1 });
RefundSchema.index({ tenantId: 1, idempotencyKey: 1 }, { sparse: true });

export const RefundModel = mongoose.model<IRefundDocument>('Refund', RefundSchema);
