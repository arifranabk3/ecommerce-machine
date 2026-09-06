import mongoose, { Schema, Document } from 'mongoose';
import { IVendorContact } from '@sellzy/shared';

export interface IVendorContactDocument extends Omit<IVendorContact, 'id'>, Document {}

const VendorContactSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    isPrimary: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true
  }
);

VendorContactSchema.index({ tenantId: 1, vendorId: 1 });

export const VendorContactModel = mongoose.model<IVendorContactDocument>('VendorContact', VendorContactSchema);
