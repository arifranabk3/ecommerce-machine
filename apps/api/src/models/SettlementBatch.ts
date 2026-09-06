import mongoose, { Schema, Document } from 'mongoose';
import { ISettlementBatch, SettlementBatchStatus } from '@sellzy/shared';

export interface ISettlementBatchDocument extends Omit<ISettlementBatch, 'id'>, Document {}

const SettlementBatchSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    batchNumber: { type: String, required: true, uppercase: true, trim: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(SettlementBatchStatus),
      default: SettlementBatchStatus.DRAFT,
      required: true,
      index: true
    },
    settlementIds: [{ type: String, required: true }],
    totalAmountMinor: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'PKR' },
    createdBy: { type: String },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

SettlementBatchSchema.index({ tenantId: 1, batchNumber: 1 }, { unique: true });
SettlementBatchSchema.index({ tenantId: 1, status: 1 });

export const SettlementBatchModel = mongoose.model<ISettlementBatchDocument>(
  'SettlementBatch',
  SettlementBatchSchema
);
