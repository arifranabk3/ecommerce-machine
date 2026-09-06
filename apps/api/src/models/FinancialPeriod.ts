import mongoose, { Schema, Document } from 'mongoose';
import { IFinancialPeriod, FinancialPeriodStatus } from '@sellzy/shared';

export interface IFinancialPeriodDocument extends Omit<IFinancialPeriod, 'id'>, Document {}

const FinancialPeriodSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(FinancialPeriodStatus),
      default: FinancialPeriodStatus.OPEN,
      required: true,
      index: true
    },
    lockedBy: { type: String },
    lockedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

FinancialPeriodSchema.index({ tenantId: 1, periodStart: 1, periodEnd: 1 }, { unique: true });

export const FinancialPeriodModel = mongoose.model<IFinancialPeriodDocument>(
  'FinancialPeriod',
  FinancialPeriodSchema
);
