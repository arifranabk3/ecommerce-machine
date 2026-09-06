import mongoose, { Schema, Document } from 'mongoose';

export interface IShipmentCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const ShipmentCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

ShipmentCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const ShipmentCounterModel = mongoose.model<IShipmentCounterDocument>(
  'ShipmentCounter',
  ShipmentCounterSchema
);
