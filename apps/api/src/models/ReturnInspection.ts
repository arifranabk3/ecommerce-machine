import mongoose, { Schema, Document } from 'mongoose';
import { IReturnInspection, ReturnItemCondition, ReturnItemDecision } from '@sellzy/shared';

export interface IReturnInspectionDocument extends Omit<IReturnInspection, 'id'>, Document {}

const ReturnInspectionSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    returnId: { type: String, required: true, index: true },
    itemId: { type: String, required: true, index: true },
    condition: { type: String, enum: Object.values(ReturnItemCondition), required: true },
    decision: { type: String, enum: Object.values(ReturnItemDecision), required: true },
    notes: { type: String },
    inspectedBy: { type: String, required: true },
    inspectedAt: { type: Date, required: true, default: Date.now }
  },
  {
    timestamps: true
  }
);

ReturnInspectionSchema.index({ tenantId: 1, returnId: 1, itemId: 1 });

export const ReturnInspectionModel = mongoose.model<IReturnInspectionDocument>(
  'ReturnInspection',
  ReturnInspectionSchema
);
