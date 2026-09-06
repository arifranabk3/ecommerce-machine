import mongoose, { Schema, Document } from 'mongoose';
import {
  IVendorLedgerEntry,
  VendorLedgerEntryType,
  VendorLedgerDirection,
  VendorLedgerStatus
} from '@sellzy/shared';

export interface IVendorLedgerEntryDocument extends Omit<IVendorLedgerEntry, 'id'>, Document {}

const VendorLedgerEntrySchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    entryNumber: { type: String, required: true, uppercase: true, trim: true },
    entryType: {
      type: String,
      enum: Object.values(VendorLedgerEntryType),
      required: true,
      index: true
    },
    direction: {
      type: String,
      enum: Object.values(VendorLedgerDirection),
      required: true
    },
    amountMinor: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: 'amountMinor must be an integer minor unit'
      }
    },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'PKR' },
    sourceType: { type: String, required: true, trim: true, index: true },
    sourceId: { type: String, required: true, trim: true, index: true },
    orderId: { type: String, index: true },
    purchaseOrderId: { type: String, index: true },
    settlementId: { type: String, index: true },
    description: { type: String, required: true, trim: true },
    reference: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(VendorLedgerStatus),
      default: VendorLedgerStatus.POSTED,
      required: true,
      index: true
    },
    reversalOfEntryId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: String }
  },
  {
    timestamps: true
  }
);

VendorLedgerEntrySchema.index({ tenantId: 1, entryNumber: 1 }, { unique: true });
VendorLedgerEntrySchema.index({ tenantId: 1, vendorId: 1, createdAt: -1 });
VendorLedgerEntrySchema.index({ tenantId: 1, vendorId: 1, entryType: 1, createdAt: -1 });
VendorLedgerEntrySchema.index({ tenantId: 1, sourceType: 1, sourceId: 1 });
VendorLedgerEntrySchema.index({ tenantId: 1, vendorId: 1, status: 1 });

export const VendorLedgerEntryModel = mongoose.model<IVendorLedgerEntryDocument>(
  'VendorLedgerEntry',
  VendorLedgerEntrySchema
);
