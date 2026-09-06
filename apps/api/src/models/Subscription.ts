import mongoose, { Schema, Document } from 'mongoose';
import { ISaaSSubscription, SaaSSubscriptionStatus } from '@sellzy/shared';

export interface ISaaSSubscriptionDocument extends Document, Omit<ISaaSSubscription, 'id'> {}

const SaaSSubscriptionSchema = new Schema<ISaaSSubscriptionDocument>(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    planId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(SaaSSubscriptionStatus),
      default: SaaSSubscriptionStatus.ACTIVE,
      index: true
    },
    billingCycle: { type: String, enum: ['MONTHLY', 'YEARLY'], default: 'MONTHLY' },
    currency: { type: String, default: 'USD' },
    currentPeriodStart: { type: Date, required: true, default: Date.now },
    currentPeriodEnd: { type: Date, required: true },
    trialStart: { type: Date },
    trialEnd: { type: Date },
    provider: { type: String, default: 'STRIPE' },
    providerCustomerId: { type: String },
    providerSubscriptionId: { type: String },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const SaaSSubscriptionModel =
  mongoose.models.SaaSSubscription || mongoose.model<ISaaSSubscriptionDocument>('SaaSSubscription', SaaSSubscriptionSchema);
export const SubscriptionModel = SaaSSubscriptionModel;

