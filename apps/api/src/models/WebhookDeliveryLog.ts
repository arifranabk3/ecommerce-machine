import mongoose, { Schema, Document } from 'mongoose';
import { IWebhookDeliveryLog } from '@sellzy/shared';

export interface IWebhookDeliveryLogDocument extends Document, Omit<IWebhookDeliveryLog, 'id'> {}

const WebhookDeliveryLogSchema = new Schema<IWebhookDeliveryLogDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    endpointId: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventType: { type: String, required: true },
    attempt: { type: Number, required: true, default: 1 },
    status: { type: String, enum: ['DELIVERED', 'FAILED'], required: true },
    httpStatus: { type: Number },
    latencyMs: { type: Number },
    error: { type: String }
  },
  { timestamps: true }
);

WebhookDeliveryLogSchema.index({ tenantId: 1, createdAt: -1 });

export const WebhookDeliveryLogModel =
  mongoose.models.WebhookDeliveryLog || mongoose.model<IWebhookDeliveryLogDocument>('WebhookDeliveryLog', WebhookDeliveryLogSchema);
