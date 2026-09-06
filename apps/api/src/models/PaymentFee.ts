import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentFeeDocument extends Document {
  tenantId: string;
  paymentId: string;
  provider: string;
  feeMinor: number;
  taxMinor: number;
  currency: string;
  source: string;
  createdAt: Date;
}

const PaymentFeeSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    feeMinor: { type: Number, required: true, default: 0 },
    taxMinor: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'PKR' },
    source: { type: String, required: true, default: 'PROVIDER' }
  },
  {
    timestamps: true
  }
);

PaymentFeeSchema.index({ tenantId: 1, paymentId: 1 });

export const PaymentFeeModel = mongoose.model<IPaymentFeeDocument>('PaymentFee', PaymentFeeSchema);
