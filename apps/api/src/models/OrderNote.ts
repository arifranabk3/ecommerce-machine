import mongoose, { Schema, Document } from 'mongoose';
import { IOrderNote } from '@sellzy/shared';

export interface IOrderNoteDocument extends Omit<IOrderNote, 'id'>, Document {}

const OrderNoteSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    authorUserId: { type: String, required: true },
    content: { type: String, required: true, max: 1000 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

OrderNoteSchema.index({ tenantId: 1, orderId: 1, createdAt: -1 });

export const OrderNoteModel = mongoose.model<IOrderNoteDocument>('OrderNote', OrderNoteSchema);
