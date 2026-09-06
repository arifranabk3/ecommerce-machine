import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorNoteDocument extends Document {
  tenantId: string;
  vendorId: string;
  authorUserId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorNoteSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    authorUserId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
);

VendorNoteSchema.index({ tenantId: 1, vendorId: 1, createdAt: -1 });

export const VendorNoteModel = mongoose.model<IVendorNoteDocument>('VendorNote', VendorNoteSchema);
