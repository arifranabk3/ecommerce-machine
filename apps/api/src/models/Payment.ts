import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '@sellzy/shared';

export interface IPaymentDocument extends Document {
  tenantId: string;
  storeId: string;
  paymentNumber: string;
  orderId: string;
  customerId?: string;
  provider: string;
  providerPaymentId?: string;
  providerTransactionId?: string;
  amountMinor: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  failureCode?: string;
  failureReason?: string;
  parentPaymentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  capturedAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    storeId: { type: String, required: true, index: true },
    paymentNumber: { type: String, required: true },
    orderId: { type: String, required: true, index: true },
    customerId: { type: String, index: true },
    provider: { type: String, required: true, default: 'MOCK' },
    providerPaymentId: { type: String, index: true },
    providerTransactionId: { type: String, index: true },
    amountMinor: { type: Number, required: true },
    currency: { type: String, required: true, default: 'PKR' },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.INITIATED,
      required: true,
      index: true
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.CARD,
      required: true
    },
    failureCode: { type: String },
    failureReason: { type: String },
    parentPaymentId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    capturedAt: { type: Date },
    failedAt: { type: Date },
    cancelledAt: { type: Date }
  },
  {
    timestamps: true
  }
);

PaymentSchema.index({ tenantId: 1, storeId: 1, paymentNumber: 1 }, { unique: true });
PaymentSchema.index({ tenantId: 1, storeId: 1, orderId: 1, createdAt: -1 });
PaymentSchema.index({ tenantId: 1, storeId: 1, provider: 1, providerPaymentId: 1 });
PaymentSchema.index({ tenantId: 1, storeId: 1, status: 1, createdAt: -1 });

export const PaymentModel = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
