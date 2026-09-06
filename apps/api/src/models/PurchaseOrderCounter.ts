import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseOrderCounterDocument extends Document {
  tenantId: string;
  seq: number;
}

const PurchaseOrderCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, required: true, default: 1000 }
  },
  {
    timestamps: true
  }
);

export const PurchaseOrderCounterModel = mongoose.model<IPurchaseOrderCounterDocument>('PurchaseOrderCounter', PurchaseOrderCounterSchema);
