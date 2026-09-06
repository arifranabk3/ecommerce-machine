import mongoose, { Schema, Document } from 'mongoose';
import { IShippingWebhookEvent } from '@sellzy/shared';

export interface IShippingWebhookEventDocument extends Omit<IShippingWebhookEvent, 'id'>, Document {}

const ShippingWebhookEventSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courier: { type: String, required: true, index: true },
    providerEventId: { type: String, required: true, index: true },
    eventType: { type: String, required: true },
    shipmentId: { type: String, index: true },
    payloadHash: { type: String },
    receivedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    status: { type: String, enum: ['PENDING', 'PROCESSED', 'FAILED', 'IGNORED'], default: 'PENDING', index: true }
  },
  {
    timestamps: true
  }
);

ShippingWebhookEventSchema.index({ courier: 1, providerEventId: 1 }, { unique: true });

export const ShippingWebhookEventModel = mongoose.model<IShippingWebhookEventDocument>(
  'ShippingWebhookEvent',
  ShippingWebhookEventSchema
);
