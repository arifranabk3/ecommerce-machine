import mongoose, { Schema, Document } from 'mongoose';
import { ILeadList } from '@sellzy/shared';

export interface ILeadListDocument extends Omit<ILeadList, 'id'>, Document {}

const LeadListSchema = new Schema<ILeadListDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    storeId: { type: String, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    leadCount: { type: Number, default: 0, min: 0 },
    tags: [{ type: String, trim: true }]
  },
  {
    timestamps: true
  }
);

LeadListSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const LeadListModel = mongoose.model<ILeadListDocument>('LeadList', LeadListSchema);

