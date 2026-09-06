import mongoose, { Schema, Document } from 'mongoose';
import { IVendorSettlement, VendorSettlementStatus } from '@sellzy/shared';

export interface IVendorSettlementDocument extends Omit<IVendorSettlement, 'id'>, Document {}

const VendorSettlementSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    settlementNumber: { type: String, required: true, uppercase: true, trim: true },
    status: {
      type: String,
      enum: Object.values(VendorSettlementStatus),
      default: VendorSettlementStatus.DRAFT,
      required: true,
      index: true
    },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'PKR' },
    grossPayableMinor: { type: Number, required: true, default: 0 },
    returnAdjustmentsMinor: { type: Number, required: true, default: 0 },
    rtoAdjustmentsMinor: { type: Number, required: true, default: 0 },
    deductionsMinor: { type: Number, required: true, default: 0 },
    previousSettlementsMinor: { type: Number, required: true, default: 0 },
    manualAdjustmentsMinor: { type: Number, required: true, default: 0 },
    netPayableMinor: { type: Number, required: true, default: 0 },
    eligibleEntryCount: { type: Number, required: true, default: 0 },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    paidAt: { type: Date },
    paymentReference: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true
  }
);

VendorSettlementSchema.index({ tenantId: 1, settlementNumber: 1 }, { unique: true });
VendorSettlementSchema.index({ tenantId: 1, vendorId: 1, createdAt: -1 });
VendorSettlementSchema.index({ tenantId: 1, vendorId: 1, status: 1 });
VendorSettlementSchema.index({ tenantId: 1, periodStart: 1, periodEnd: 1 });

export const VendorSettlementModel = mongoose.model<IVendorSettlementDocument>(
  'VendorSettlement',
  VendorSettlementSchema
);
