import mongoose, { Schema, Document } from 'mongoose';
import { IImportJob, IImportColumnMapping } from '@sellzy/shared';

export interface IImportJobDocument extends Omit<IImportJob, 'id'>, Document {}

const ImportJobSchema = new Schema<IImportJobDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    storeId: { type: String, index: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    totalRows: { type: Number, default: 0 },
    validRows: { type: Number, default: 0 },
    invalidRows: { type: Number, default: 0 },
    duplicateRows: { type: Number, default: 0 },
    exactMatchRows: { type: Number, default: 0 },
    excelOnlyRows: { type: Number, default: 0 },
    grabbedOnlyRows: { type: Number, default: 0 },
    suppressedRows: { type: Number, default: 0 },
    mapping: {
      email: { type: String, required: true },
      companyName: { type: String },
      website: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String },
      city: { type: String },
      state: { type: String },
      industry: { type: String },
      source: { type: String }
    }
  },
  {
    timestamps: true
  }
);

ImportJobSchema.index({ tenantId: 1, createdAt: -1 });

export const ImportJobModel = mongoose.model<IImportJobDocument>('ImportJob', ImportJobSchema);

