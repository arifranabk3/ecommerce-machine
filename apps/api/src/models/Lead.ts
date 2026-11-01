import mongoose, { Schema, Document } from 'mongoose';
import { ILead, LeadVerificationStatus, LeadSourceType } from '@sellzy/shared';

export interface ILeadDocument extends Omit<ILead, 'id'>, Document {}

const LeadSchema = new Schema<ILeadDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    storeId: { type: String, index: true },
    companyName: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    normalizedEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    state: { type: String, trim: true, index: true },
    country: { type: String, required: true, default: 'US', uppercase: true, index: true },
    industry: { type: String, trim: true, index: true },
    source: {
      type: String,
      enum: Object.values(LeadSourceType),
      default: LeadSourceType.DIRECTORY_SEARCH,
      required: true
    },
    sourceUrl: { type: String, trim: true },
    collectedAt: { type: Date, default: Date.now, required: true },
    verificationStatus: {
      type: String,
      enum: Object.values(LeadVerificationStatus),
      default: LeadVerificationStatus.UNVERIFIED,
      required: true,
      index: true
    },
    verificationDetails: {
      verifiedAt: { type: Date },
      provider: { type: String },
      mxFound: { type: Boolean },
      isDisposable: { type: Boolean },
      isRoleAccount: { type: Boolean },
      rawResponse: { type: String }
    },
    listIds: [{ type: String, index: true }],
    tags: [{ type: String, trim: true }],
    notes: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

// Compound Unique Index: Prevents duplicate email collection within the same tenant
LeadSchema.index({ tenantId: 1, normalizedEmail: 1 }, { unique: true });
LeadSchema.index({ tenantId: 1, state: 1, city: 1 });
LeadSchema.index({ tenantId: 1, verificationStatus: 1 });
LeadSchema.index({ tenantId: 1, listIds: 1 });

export const LeadModel = mongoose.model<ILeadDocument>('Lead', LeadSchema);

