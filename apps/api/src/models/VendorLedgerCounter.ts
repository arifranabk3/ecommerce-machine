import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorLedgerCounterDocument extends Document {
  tenantId: string;
  seq: number;
}

const VendorLedgerCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

export const VendorLedgerCounterModel = mongoose.model<IVendorLedgerCounterDocument>(
  'VendorLedgerCounter',
  VendorLedgerCounterSchema
);
