import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerCounterDocument extends Document {
  tenantId: string;
  seq: number;
  updatedAt: Date;
}

const CustomerCounterSchema = new Schema<ICustomerCounterDocument>(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CustomerCounterModel = mongoose.model<ICustomerCounterDocument>('CustomerCounter', CustomerCounterSchema);
