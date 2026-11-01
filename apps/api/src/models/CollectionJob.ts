import mongoose, { Schema, Document } from 'mongoose';
import { ICollectionJob, CollectionJobStatus } from '@sellzy/shared';

export interface ICollectionJobDocument extends Omit<ICollectionJob, 'id'>, Document {}

const CollectionJobSchema = new Schema<ICollectionJobDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    storeId: { type: String, index: true },
    country: { type: String, required: true, uppercase: true, index: true },
    status: {
      type: String,
      enum: Object.values(CollectionJobStatus),
      default: CollectionJobStatus.QUEUED,
      required: true,
      index: true
    },
    filters: {
      country: { type: String, required: true },
      industry: { type: String },
      state: { type: String },
      city: { type: String },
      businessType: { type: String },
      businessName: { type: String },
      website: { type: String },
      maxRecords: { type: Number, default: 25 },
      targetListId: { type: String }
    },
    totalDiscovered: { type: Number, default: 0 },
    emailsCollected: { type: Number, default: 0 },
    duplicatesSkipped: { type: Number, default: 0 },
    invalidRecords: { type: Number, default: 0 },
    recordsSaved: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    errorDetails: { type: String }
  },
  {
    timestamps: true
  }
);

CollectionJobSchema.index({ tenantId: 1, createdAt: -1 });
CollectionJobSchema.index({ tenantId: 1, status: 1 });

export const CollectionJobModel = mongoose.model<ICollectionJobDocument>('CollectionJob', CollectionJobSchema);
