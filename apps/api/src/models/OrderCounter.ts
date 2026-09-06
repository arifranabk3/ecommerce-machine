import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const OrderCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true },
    year: { type: Number, required: true },
    seq: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

OrderCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const OrderCounterModel = mongoose.model<IOrderCounterDocument>('OrderCounter', OrderCounterSchema);
