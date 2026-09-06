import mongoose, { Schema, Document } from 'mongoose';
import { CustomerAddressType } from '@sellzy/shared';

export interface ICustomerAddressDocument extends Document {
  tenantId: string;
  customerId: string;
  type: CustomerAddressType;
  label?: string;
  fullName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerAddressSchema = new Schema<ICustomerAddressDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(CustomerAddressType),
      default: CustomerAddressType.SHIPPING,
    },
    label: { type: String, trim: true },
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CustomerAddressSchema.index({ tenantId: 1, customerId: 1 });

export const CustomerAddressModel = mongoose.model<ICustomerAddressDocument>('CustomerAddress', CustomerAddressSchema);
