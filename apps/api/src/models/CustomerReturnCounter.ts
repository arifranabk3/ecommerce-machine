import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerReturnCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const CustomerReturnCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

CustomerReturnCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const CustomerReturnCounterModel = mongoose.model<ICustomerReturnCounterDocument>(
  'CustomerReturnCounter',
  CustomerReturnCounterSchema
);
