import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorCounterDocument extends Document {
  tenantId: string;
  seq: number;
}

const VendorCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, required: true, default: 1000 }
  },
  {
    timestamps: true
  }
);

export const VendorCounterModel = mongoose.model<IVendorCounterDocument>('VendorCounter', VendorCounterSchema);
