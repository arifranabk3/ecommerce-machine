import mongoose, { Schema, Document } from 'mongoose';
import { ICommunicationWebhookEvent, CommunicationChannel } from '@sellzy/shared';

export interface ICommunicationWebhookEventDocument extends Omit<ICommunicationWebhookEvent, 'id'>, Document {}

const CommunicationWebhookEventSchema: Schema = new Schema(
  {
    tenantId: { type: String, index: true },
    channel: { type: String, enum: Object.values(CommunicationChannel), required: true, index: true },
    provider: { type: String, required: true, index: true },
    providerEventId: { type: String, required: true, index: true },
    eventType: { type: String, required: true },
    payloadHash: { type: String },
    processed: { type: Boolean, default: false, required: true, index: true },
    processedAt: { type: Date },
    error: { type: String }
  },
  {
    timestamps: true
  }
);

CommunicationWebhookEventSchema.index({ provider: 1, providerEventId: 1 }, { unique: true });

export const CommunicationWebhookEventModel = mongoose.model<ICommunicationWebhookEventDocument>(
  'CommunicationWebhookEvent',
  CommunicationWebhookEventSchema
);
