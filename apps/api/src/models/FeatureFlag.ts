import mongoose, { Schema, Document } from 'mongoose';
import { IFeatureFlag } from '@sellzy/shared';

export interface IFeatureFlagDocument extends Document, Omit<IFeatureFlag, 'id'> {}

const FeatureFlagSchema = new Schema<IFeatureFlagDocument>(
  {
    key: { type: String, required: true, unique: true, index: true, uppercase: true },
    description: { type: String, default: '' },
    enabled: { type: Boolean, default: false },
    global: { type: Boolean, default: true },
    tenantIds: [{ type: String }],
    rolloutPercentage: { type: Number, default: 100, min: 0, max: 100 },
    environment: { type: String, default: 'production' }
  },
  { timestamps: true }
);

export const FeatureFlagModel =
  mongoose.models.FeatureFlag || mongoose.model<IFeatureFlagDocument>('FeatureFlag', FeatureFlagSchema);
