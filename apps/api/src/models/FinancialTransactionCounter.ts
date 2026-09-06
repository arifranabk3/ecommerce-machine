import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialTransactionCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const FinancialTransactionCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

FinancialTransactionCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const FinancialTransactionCounterModel = mongoose.model<IFinancialTransactionCounterDocument>(
  'FinancialTransactionCounter',
  FinancialTransactionCounterSchema
);
