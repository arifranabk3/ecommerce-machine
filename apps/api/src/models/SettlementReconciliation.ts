import mongoose, { Schema, Document } from 'mongoose';
import { ISettlementReconciliation, ReconciliationStatus } from '@sellzy/shared';

export interface ISettlementReconciliationDocument extends Omit<ISettlementReconciliation, 'id'>, Document {}

const SettlementReconciliationSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    settlementId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    paymentId: { type: String, index: true },
    expectedAmountMinor: { type: Number, required: true },
    actualAmountMinor: { type: Number, required: true },
    differenceMinor: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ReconciliationStatus),
      default: ReconciliationStatus.PENDING,
      required: true,
      index: true
    },
    notes: { type: String, trim: true },
    resolvedBy: { type: String },
    resolvedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

SettlementReconciliationSchema.index({ tenantId: 1, settlementId: 1 }, { unique: true });

export const SettlementReconciliationModel = mongoose.model<ISettlementReconciliationDocument>(
  'SettlementReconciliation',
  SettlementReconciliationSchema
);
