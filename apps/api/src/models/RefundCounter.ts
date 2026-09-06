import mongoose, { Schema, Document } from 'mongoose';

export interface IRefundCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const RefundCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

RefundCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const RefundCounterModel = mongoose.model<IRefundCounterDocument>(
  'RefundCounter',
  RefundCounterSchema
);
