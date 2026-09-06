import mongoose, { Schema, Document } from 'mongoose';
import { IShipmentTrackingEvent, ShipmentStatus } from '@sellzy/shared';

export interface IShipmentTrackingEventDocument extends Omit<IShipmentTrackingEvent, 'id'>, Document {}

const ShipmentTrackingEventSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    shipmentId: { type: String, required: true, index: true },
    eventId: { type: String, required: true },
    eventType: { type: String, required: true },
    status: { type: String, enum: Object.values(ShipmentStatus), required: true },
    carrierStatus: { type: String },
    location: { type: String },
    description: { type: String },
    eventAt: { type: Date, required: true, default: Date.now },
    receivedAt: { type: Date, required: true, default: Date.now },
    source: { type: String, enum: ['COURIER', 'SYSTEM', 'MANUAL'], default: 'COURIER' },
    metadata: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
);

ShipmentTrackingEventSchema.index({ tenantId: 1, shipmentId: 1, eventAt: -1 });

export const ShipmentTrackingEventModel = mongoose.model<IShipmentTrackingEventDocument>(
  'ShipmentTrackingEvent',
  ShipmentTrackingEventSchema
);
