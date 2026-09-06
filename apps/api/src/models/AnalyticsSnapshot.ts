import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsSnapshotDocument extends Document {
  tenantId: string;
  reportName: string;
  filters: Record<string, unknown>;
  snapshotData: Record<string, unknown>;
  generatedAt: Date;
  dataVersion: string;
}

const AnalyticsSnapshotSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    reportName: { type: String, required: true, trim: true },
    filters: { type: Schema.Types.Mixed, default: {} },
    snapshotData: { type: Schema.Types.Mixed, required: true },
    generatedAt: { type: Date, default: Date.now },
    dataVersion: { type: String, default: '1.0' }
  },
  { timestamps: true }
);

AnalyticsSnapshotSchema.index({ tenantId: 1, reportName: 1, generatedAt: -1 });

export const AnalyticsSnapshotModel = mongoose.model<IAnalyticsSnapshotDocument>(
  'AnalyticsSnapshot',
  AnalyticsSnapshotSchema
);
