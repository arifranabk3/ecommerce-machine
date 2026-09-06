import mongoose, { Schema, Document } from 'mongoose';
import { IVendor, VendorStatus, VendorType, PaymentTerms } from '@sellzy/shared';

export interface IVendorDocument extends Omit<IVendor, 'id'>, Document {}

const VendorAddressSchema = new Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  { _id: false }
);

const VendorSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorNumber: { type: String, required: true, trim: true },
    normalizedVendorNumber: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    taxId: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(VendorStatus),
      default: VendorStatus.ACTIVE,
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(VendorType),
      default: VendorType.DISTRIBUTOR,
      required: true
    },
    paymentTerms: {
      type: String,
      enum: Object.values(PaymentTerms),
      default: PaymentTerms.NET_30,
      required: true
    },
    currency: { type: String, required: true, default: 'USD', uppercase: true, length: 3 },
    minimumOrderQuantity: { type: Number, required: true, default: 1, min: 0 },
    minimumOrderValueMinor: { type: Number, required: true, default: 0, min: 0 },
    leadTimeDays: { type: Number, required: true, default: 7, min: 0 },
    autoOrderEnabled: { type: Boolean, required: true, default: false },
    autoOrderThresholdMinor: { type: Number, required: true, default: 100000, min: 0 },
    rating: { type: Number, required: true, default: 5, min: 0, max: 5 },
    address: { type: VendorAddressSchema },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true
  }
);

VendorSchema.index({ tenantId: 1, normalizedVendorNumber: 1 }, { unique: true });
VendorSchema.index({ tenantId: 1, name: 1 });
VendorSchema.index({ tenantId: 1, status: 1 });
VendorSchema.index({ tenantId: 1, createdAt: -1 });

export const VendorModel = mongoose.model<IVendorDocument>('Vendor', VendorSchema);
