import mongoose, { Schema, Document } from 'mongoose';
import { IWebhookEndpoint } from '@sellzy/shared';

export interface IWebhookEndpointDocument extends Document, Omit<IWebhookEndpoint, 'id'> {}

const WebhookEndpointSchema = new Schema<IWebhookEndpointDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    url: { type: String, required: true, trim: true },
    events: [{ type: String, required: true }],
    active: { type: Boolean, default: true },
    signingSecret: { type: String, required: true },
    retryPolicy: {
      maxRetries: { type: Number, default: 3 },
      backoffFactor: { type: Number, default: 2 }
    }
  },
  { timestamps: true }
);

WebhookEndpointSchema.index({ tenantId: 1, active: 1 });

export const WebhookEndpointModel =
  mongoose.models.WebhookEndpoint || mongoose.model<IWebhookEndpointDocument>('WebhookEndpoint', WebhookEndpointSchema);
