import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorDocumentDocument extends Document {
  tenantId: string;
  vendorId: string;
  title: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorDocumentSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

VendorDocumentSchema.index({ tenantId: 1, vendorId: 1, createdAt: -1 });

export const VendorDocumentModel = mongoose.model<IVendorDocumentDocument>('VendorDocument', VendorDocumentSchema);
