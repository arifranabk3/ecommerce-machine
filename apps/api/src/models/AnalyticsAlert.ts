import mongoose, { Schema, Document } from 'mongoose';
import { IAnalyticsAlert } from '@sellzy/shared';

export interface IAnalyticsAlertDocument extends Omit<IAnalyticsAlert, 'id'>, Document {}

const AnalyticsAlertSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    metric: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ['GREATER_THAN', 'LESS_THAN', 'EQUALS', 'CHANGE_PERCENT'],
      required: true
    },
    threshold: { type: Number, required: true },
    frequency: { type: String, default: 'DAILY' },
    enabled: { type: Boolean, default: true },
    recipients: [{ type: String }],
    cooldownSeconds: { type: Number, default: 86400 },
    lastTriggeredAt: { type: Date }
  },
  { timestamps: true }
);

AnalyticsAlertSchema.index({ tenantId: 1, metric: 1 });

export const AnalyticsAlertModel = mongoose.model<IAnalyticsAlertDocument>(
  'AnalyticsAlert',
  AnalyticsAlertSchema
);
