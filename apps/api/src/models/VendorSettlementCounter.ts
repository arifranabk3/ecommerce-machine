import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorSettlementCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const VendorSettlementCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

VendorSettlementCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const VendorSettlementCounterModel = mongoose.model<IVendorSettlementCounterDocument>(
  'VendorSettlementCounter',
  VendorSettlementCounterSchema
);
