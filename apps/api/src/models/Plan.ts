import mongoose, { Schema, Document } from 'mongoose';
import { ISaaSPlan, SaaSPlanSlug } from '@sellzy/shared';

export interface ISaaSPlanDocument extends Document, Omit<ISaaSPlan, 'id'> {}

const SaaSPlanSchema = new Schema<ISaaSPlanDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, uppercase: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    monthlyPriceMinor: { type: Number, required: true, default: 0 },
    yearlyPriceMinor: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    limits: {
      productsMax: { type: Number, default: 100 },
      usersMax: { type: Number, default: 5 },
      ordersMonthly: { type: Number, default: 1000 },
      customersMax: { type: Number, default: 1000 },
      vendorsMax: { type: Number, default: 10 },
      locationsMax: { type: Number, default: 2 },
      automationMax: { type: Number, default: 10 },
      messagesMonthly: { type: Number, default: 500 },
      campaignsMax: { type: Number, default: 5 },
      storageMaxMb: { type: Number, default: 1024 },
      apiRequestsMonthly: { type: Number, default: 10000 },
      exportsMonthly: { type: Number, default: 50 },
      scheduledReportsMax: { type: Number, default: 5 }
    },
    features: [{ type: String }],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const SaaSPlanModel = mongoose.models.SaaSPlan || mongoose.model<ISaaSPlanDocument>('SaaSPlan', SaaSPlanSchema);
export const PlanModel = SaaSPlanModel;

