import mongoose, { Schema, Document } from 'mongoose';

export interface IRTOCounterDocument extends Document {
  tenantId: string;
  year: number;
  seq: number;
}

const RTOCounterSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    seq: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

RTOCounterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

export const RTOCounterModel = mongoose.model<IRTOCounterDocument>('RTOCounter', RTOCounterSchema);
