import mongoose, { Document, Schema } from 'mongoose';

export interface ITenantDocument extends Document {
  tenantId: string;
  businessName: string;
  legalName?: string;
  slug: string;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'DISABLED' | 'PENDING' | 'CANCELLED';
  ownerUserId: string;
  planId: string;
  subscriptionStatus: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED';
  timezone: string;
  currency: string;
  country: string;
  locale: string;
  logo?: string;
  settings: Record<string, unknown>;
  featureConfig: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
  suspendedAt?: Date;
  deletedAt?: Date;
}

const tenantSchema = new Schema<ITenantDocument>({
  tenantId: { type: String, required: true, unique: true, index: true },
  businessName: { type: String, required: true },
  legalName: { type: String },
  slug: { type: String, required: true, unique: true, index: true },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'TRIAL', 'SUSPENDED', 'DISABLED', 'PENDING', 'CANCELLED'], 
    default: 'ACTIVE', 
    index: true 
  },
  ownerUserId: { type: String, required: true, index: true },
  planId: { type: String, required: true, default: 'STARTER' },
  subscriptionStatus: { 
    type: String, 
    enum: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED', 'PAUSED'], 
    default: 'ACTIVE' 
  },
  timezone: { type: String, required: true, default: 'UTC' },
  currency: { type: String, required: true, default: 'PKR' }, // Default PKR minor units
  country: { type: String, required: true, default: 'PK' },
  locale: { type: String, required: true, default: 'en-PK' },
  logo: { type: String },
  settings: { type: Object, default: {} },
  featureConfig: { type: Object, default: {} },
  suspendedAt: { type: Date },
  deletedAt: { type: Date }
}, {
  timestamps: true
});

export const TenantModel = mongoose.model<ITenantDocument>('Tenant', tenantSchema);
