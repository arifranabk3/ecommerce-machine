import mongoose, { Schema, Document } from 'mongoose';
import { IAnalyticsExportJob, AnalyticsReportType, AnalyticsExportFormat, AnalyticsExportStatus } from '@sellzy/shared';

export interface IAnalyticsExportJobDocument extends Omit<IAnalyticsExportJob, 'id'>, Document {}

const AnalyticsExportJobSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    reportType: {
      type: String,
      enum: Object.values(AnalyticsReportType),
      required: true
    },
    format: {
      type: String,
      enum: Object.values(AnalyticsExportFormat),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(AnalyticsExportStatus),
      default: AnalyticsExportStatus.PENDING,
      required: true
    },
    downloadUrl: { type: String },
    rowCount: { type: Number, default: 0 },
    error: { type: String },
    requestedBy: { type: String, required: true }
  },
  { timestamps: true }
);

AnalyticsExportJobSchema.index({ tenantId: 1, createdAt: -1 });

export const AnalyticsExportJobModel = mongoose.model<IAnalyticsExportJobDocument>(
  'AnalyticsExportJob',
  AnalyticsExportJobSchema
);
