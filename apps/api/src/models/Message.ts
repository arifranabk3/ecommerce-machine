import mongoose, { Schema, Document } from 'mongoose';
import { IMessage, CommunicationChannel, MessageDirection, MessageStatus } from '@sellzy/shared';

export interface IMessageDocument extends Omit<IMessage, 'id'>, Document {
  content: string;
  metadata?: any;
}

const MessageSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    conversationId: { type: String, index: true },
    customerId: { type: String, index: true },
    senderId: { type: String },
    channel: { type: String, enum: Object.values(CommunicationChannel), required: true, index: true },
    direction: { type: String, enum: Object.values(MessageDirection), required: true, index: true },
    messageType: { type: String, enum: ['TEXT', 'TEMPLATE', 'MEDIA', 'INTERACTIVE'], default: 'TEXT', required: true },
    providerMessageId: { type: String, index: true },
    idempotencyKey: { type: String, index: true },
    templateId: { type: String },
    campaignId: { type: String, index: true },
    body: { type: String, required: true },
    mediaUrl: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.PENDING, required: true, index: true },
    errorCode: { type: String },
    errorMessage: { type: String },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    readAt: { type: Date },
    failedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

MessageSchema.virtual('content').get(function (this: any) {
  return this.body;
}).set(function (this: any, val: string) {
  this.body = val;
});

MessageSchema.index({ tenantId: 1, conversationId: 1, createdAt: -1 });
MessageSchema.index({ tenantId: 1, idempotencyKey: 1 }, { unique: true, sparse: true });
MessageSchema.index({ tenantId: 1, providerMessageId: 1 }, { sparse: true });
MessageSchema.index({ tenantId: 1, status: 1 });

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
