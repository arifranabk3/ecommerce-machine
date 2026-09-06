import mongoose, { Schema, Document } from 'mongoose';
import { IShipment, ShipmentStatus } from '@sellzy/shared';

export interface IShipmentDocument extends Omit<IShipment, 'id'>, Document {}

const ShipmentSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    shipmentNumber: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    fulfillmentId: { type: String, index: true },
    customerId: { type: String, index: true },
    vendorId: { type: String, index: true },
    courierId: { type: String, required: true, index: true },
    courierName: { type: String, required: true },
    trackingNumber: { type: String, index: true },
    trackingUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      default: ShipmentStatus.DRAFT,
      required: true,
      index: true
    },
    carrierStatus: { type: String },
    serviceType: { type: String },
    shippingMethod: { type: String },
    packageCount: { type: Number, required: true, default: 1 },
    weightGrams: { type: Number },
    dimensions: {
      lengthCm: Number,
      widthCm: Number,
      heightCm: Number
    },
    codAmountMinor: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'PKR' },
    shippingCostMinor: { type: Number, required: true, default: 0 },
    rtoCostMinor: { type: Number, required: true, default: 0 },
    labelUrl: { type: String },
    pickupScheduledAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    outForDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
    failedAt: { type: Date },
    returnedAt: { type: Date },
    estimatedDeliveryAt: { type: Date },
    exceptionCode: { type: String },
    exceptionReason: { type: String },
    metadata: { type: Schema.Types.Mixed },
    createdBy: { type: String }
  },
  {
    timestamps: true
  }
);

ShipmentSchema.index({ tenantId: 1, shipmentNumber: 1 }, { unique: true });
ShipmentSchema.index({ tenantId: 1, orderId: 1, createdAt: -1 });
ShipmentSchema.index({ tenantId: 1, trackingNumber: 1 }, { sparse: true });
ShipmentSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

export const ShipmentModel = mongoose.model<IShipmentDocument>('Shipment', ShipmentSchema);
