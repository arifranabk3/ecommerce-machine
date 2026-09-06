import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const PaymentCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

PaymentCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const PaymentCounterModel = mongoose.model<IPaymentCounterDocument>(
  'PaymentCounter',
  PaymentCounterSchema
);
