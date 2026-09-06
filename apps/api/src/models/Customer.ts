import mongoose, { Schema, Document } from 'mongoose';
import { CustomerStatus, CustomerLifecycleStage, CustomerSource } from '@sellzy/shared';

export interface ICustomerDocument extends Document {
  tenantId: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email?: string;
  normalizedEmail?: string;
  phone?: string;
  normalizedPhone?: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  companyName?: string;
  status: CustomerStatus;
  lifecycleStage: CustomerLifecycleStage;
  source: CustomerSource;
  tags: string[];
  notesSummary?: string;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  marketingConsent: boolean;
  marketingConsentAt?: Date;
  marketingConsentSource?: string;
  totalOrders: number;
  totalSpentMinor: number;
  averageOrderValueMinor: number;
  firstOrderAt?: Date;
  lastOrderAt?: Date;
  mergedIntoCustomerId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomerDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    customerNumber: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    normalizedEmail: { type: String, trim: true, index: true },
    phone: { type: String, trim: true },
    normalizedPhone: { type: String, trim: true, index: true },
    alternatePhone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    companyName: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(CustomerStatus),
      default: CustomerStatus.ACTIVE,
      index: true,
    },
    lifecycleStage: {
      type: String,
      enum: Object.values(CustomerLifecycleStage),
      default: CustomerLifecycleStage.NEW,
      index: true,
    },
    source: {
      type: String,
      enum: Object.values(CustomerSource),
      default: CustomerSource.MANUAL,
    },
    tags: [{ type: String, trim: true }],
    notesSummary: { type: String, trim: true },
    defaultShippingAddressId: { type: String },
    defaultBillingAddressId: { type: String },
    marketingConsent: { type: Boolean, default: false },
    marketingConsentAt: { type: Date },
    marketingConsentSource: { type: String },
    totalOrders: { type: Number, default: 0, min: 0 },
    totalSpentMinor: { type: Number, default: 0, min: 0 },
    averageOrderValueMinor: { type: Number, default: 0, min: 0 },
    firstOrderAt: { type: Date },
    lastOrderAt: { type: Date, index: true },
    mergedIntoCustomerId: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

// Compound Indexes for fast tenant-scoped CRM search & deduplication
CustomerSchema.index({ tenantId: 1, customerNumber: 1 }, { unique: true });
CustomerSchema.index({ tenantId: 1, normalizedEmail: 1 });
CustomerSchema.index({ tenantId: 1, normalizedPhone: 1 });
CustomerSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
CustomerSchema.index({ tenantId: 1, lifecycleStage: 1 });
CustomerSchema.index({ tenantId: 1, createdAt: -1 });
CustomerSchema.index({ tenantId: 1, lastOrderAt: -1 });

export const CustomerModel = mongoose.model<ICustomerDocument>('Customer', CustomerSchema);
