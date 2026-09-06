import mongoose, { Schema, Document } from 'mongoose';
import { FinancialTransactionType, FinancialTransactionDirection } from '@sellzy/shared';

export interface IFinancialTransactionDocument extends Document {
  tenantId: string;
  transactionNumber: string;
  type: FinancialTransactionType;
  direction: FinancialTransactionDirection;
  amountMinor: number;
  currency: string;
  sourceType: string;
  sourceId: string;
  status: 'POSTED' | 'REVERSED';
  createdAt: Date;
}

const FinancialTransactionSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    transactionNumber: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(FinancialTransactionType),
      required: true,
      index: true
    },
    direction: {
      type: String,
      enum: Object.values(FinancialTransactionDirection),
      required: true
    },
    amountMinor: { type: Number, required: true },
    currency: { type: String, required: true, default: 'PKR' },
    sourceType: { type: String, required: true, index: true },
    sourceId: { type: String, required: true, index: true },
    status: { type: String, enum: ['POSTED', 'REVERSED'], default: 'POSTED', required: true }
  },
  {
    timestamps: true
  }
);

FinancialTransactionSchema.index({ tenantId: 1, transactionNumber: 1 }, { unique: true });
FinancialTransactionSchema.index({ tenantId: 1, sourceType: 1, sourceId: 1 });
FinancialTransactionSchema.index({ tenantId: 1, createdAt: -1 });

export const FinancialTransactionModel = mongoose.model<IFinancialTransactionDocument>(
  'FinancialTransaction',
  FinancialTransactionSchema
);
