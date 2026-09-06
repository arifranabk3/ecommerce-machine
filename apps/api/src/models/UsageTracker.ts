import mongoose, { Document, Schema } from 'mongoose';

export interface IUsageTrackerDocument extends Document {
  tenantId: string;
  metric: string;
  period: string; // Format: YYYY-MM
  currentUsage: number;
  limit: number;
  updatedAt: Date;
}

const usageTrackerSchema = new Schema<IUsageTrackerDocument>({
  tenantId: { type: String, required: true, index: true },
  metric: { type: String, required: true },
  period: { type: String, required: true },
  currentUsage: { type: Number, required: true, default: 0 },
  limit: { type: Number, required: true, default: 1000 }
}, {
  timestamps: true
});

usageTrackerSchema.index({ tenantId: 1, metric: 1, period: 1 }, { unique: true });

export const UsageTrackerModel = mongoose.model<IUsageTrackerDocument>('UsageTracker', usageTrackerSchema);
