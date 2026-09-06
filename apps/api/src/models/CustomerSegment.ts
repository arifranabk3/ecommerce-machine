import mongoose, { Schema, Document } from 'mongoose';
import { ISegmentCondition } from '@sellzy/shared';

export interface ICustomerSegmentDocument extends Document {
  tenantId: string;
  name: string;
  description?: string;
  conditions: ISegmentCondition[];
  isSystem?: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SegmentConditionSchema = new Schema<ISegmentCondition>(
  {
    field: {
      type: String,
      required: true,
      enum: ['totalSpentMinor', 'totalOrders', 'averageOrderValueMinor', 'lifecycleStage', 'status', 'source', 'tags', 'country'],
    },
    operator: {
      type: String,
      required: true,
      enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains'],
    },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const CustomerSegmentSchema = new Schema<ICustomerSegmentDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    conditions: [SegmentConditionSchema],
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE', index: true },
    createdBy: { type: String },
  },
  { timestamps: true }
);

CustomerSegmentSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const CustomerSegmentModel = mongoose.model<ICustomerSegmentDocument>('CustomerSegment', CustomerSegmentSchema);
