import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentWebhookEventDocument extends Document {
  tenantId: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  paymentId?: string;
  receivedAt: Date;
  processedAt?: Date;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'IGNORED';
  payloadHash?: string;
}

const PaymentWebhookEventSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    providerEventId: { type: String, required: true },
    eventType: { type: String, required: true },
    paymentId: { type: String, index: true },
    receivedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'FAILED', 'IGNORED'],
      default: 'PENDING',
      required: true
    },
    payloadHash: { type: String }
  },
  {
    timestamps: true
  }
);

PaymentWebhookEventSchema.index({ provider: 1, providerEventId: 1 }, { unique: true });
PaymentWebhookEventSchema.index({ tenantId: 1, createdAt: -1 });

export const PaymentWebhookEventModel = mongoose.model<IPaymentWebhookEventDocument>(
  'PaymentWebhookEvent',
  PaymentWebhookEventSchema
);
