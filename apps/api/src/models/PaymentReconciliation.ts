import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus, PaymentReconciliationStatus } from '@sellzy/shared';

export interface IPaymentReconciliationDocument extends Document {
  tenantId: string;
  paymentId: string;
  orderId: string;
  internalAmountMinor: number;
  providerAmountMinor: number;
  internalCurrency: string;
  providerCurrency: string;
  internalStatus: PaymentStatus;
  providerStatus: string;
  status: PaymentReconciliationStatus;
  differenceMinor: number;
  notes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentReconciliationSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    internalAmountMinor: { type: Number, required: true },
    providerAmountMinor: { type: Number, required: true },
    internalCurrency: { type: String, required: true },
    providerCurrency: { type: String, required: true },
    internalStatus: { type: String, enum: Object.values(PaymentStatus), required: true },
    providerStatus: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PaymentReconciliationStatus),
      default: PaymentReconciliationStatus.PENDING,
      required: true,
      index: true
    },
    differenceMinor: { type: Number, required: true, default: 0 },
    notes: { type: String },
    resolvedBy: { type: String },
    resolvedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

PaymentReconciliationSchema.index({ tenantId: 1, paymentId: 1 });
PaymentReconciliationSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

export const PaymentReconciliationModel = mongoose.model<IPaymentReconciliationDocument>(
  'PaymentReconciliation',
  PaymentReconciliationSchema
);
