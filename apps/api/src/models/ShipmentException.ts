import mongoose, { Schema, Document } from 'mongoose';
import { IShipmentException, ShipmentExceptionType } from '@sellzy/shared';

export interface IShipmentExceptionDocument extends Omit<IShipmentException, 'id'>, Document {}

const ShipmentExceptionSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    shipmentId: { type: String, required: true, index: true },
    type: { type: String, enum: Object.values(ShipmentExceptionType), required: true, index: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'], default: 'OPEN', index: true },
    description: { type: String, required: true },
    resolvedAt: { type: Date },
    resolvedBy: { type: String }
  },
  {
    timestamps: true
  }
);

ShipmentExceptionSchema.index({ tenantId: 1, shipmentId: 1, createdAt: -1 });

export const ShipmentExceptionModel = mongoose.model<IShipmentExceptionDocument>(
  'ShipmentException',
  ShipmentExceptionSchema
);
