import mongoose, { Schema, Document } from 'mongoose';
import { IMetricDefinition } from '@sellzy/shared';

export interface IMetricDefinitionDocument extends IMetricDefinition, Document {}

const MetricDefinitionSchema: Schema = new Schema(
  {
    metricName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    sourceCollection: { type: String, required: true, trim: true },
    calculationType: {
      type: String,
      enum: ['SUM', 'COUNT', 'AVERAGE', 'RATIO', 'DERIVED'],
      required: true
    },
    isMinorUnit: { type: Boolean, default: false },
    currencyAware: { type: Boolean, default: true },
    permissionRequired: { type: String, required: true }
  },
  { timestamps: true }
);

export const MetricDefinitionModel = mongoose.model<IMetricDefinitionDocument>(
  'MetricDefinition',
  MetricDefinitionSchema
);
