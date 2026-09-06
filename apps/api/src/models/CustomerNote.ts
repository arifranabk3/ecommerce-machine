import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerNoteDocument extends Document {
  tenantId: string;
  customerId: string;
  authorUserId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerNoteSchema = new Schema<ICustomerNoteDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    authorUserId: { type: String, required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

CustomerNoteSchema.index({ tenantId: 1, customerId: 1, createdAt: -1 });

export const CustomerNoteModel = mongoose.model<ICustomerNoteDocument>('CustomerNote', CustomerNoteSchema);
