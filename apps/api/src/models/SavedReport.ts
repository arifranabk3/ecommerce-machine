import mongoose, { Schema, Document } from 'mongoose';
import { ISavedReport, AnalyticsReportType } from '@sellzy/shared';

export interface ISavedReportDocument extends Omit<ISavedReport, 'id'>, Document {}

const SavedReportSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    reportType: {
      type: String,
      enum: Object.values(AnalyticsReportType),
      required: true
    },
    metrics: [{ type: String, required: true }],
    dimensions: [{ type: String }],
    filters: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: String, required: true },
    isScheduled: { type: Boolean, default: false },
    scheduleConfig: {
      frequency: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'] },
      recipients: [{ type: String }]
    }
  },
  { timestamps: true }
);

SavedReportSchema.index({ tenantId: 1, createdAt: -1 });

export const SavedReportModel = mongoose.model<ISavedReportDocument>(
  'SavedReport',
  SavedReportSchema
);
