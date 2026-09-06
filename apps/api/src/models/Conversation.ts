import mongoose, { Schema, Document } from 'mongoose';
import { IConversation, CommunicationChannel, ConversationStatus } from '@sellzy/shared';

export interface IConversationDocument extends Omit<IConversation, 'id'>, Document {}

const ConversationSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    channel: { type: String, enum: Object.values(CommunicationChannel), required: true, index: true },
    channelConversationId: { type: String },
    status: { type: String, enum: Object.values(ConversationStatus), default: ConversationStatus.OPEN, required: true, index: true },
    assignedUserId: { type: String, index: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    metadata: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
);

ConversationSchema.index({ tenantId: 1, customerId: 1, channel: 1 });
ConversationSchema.index({ tenantId: 1, status: 1 });
ConversationSchema.index({ tenantId: 1, assignedUserId: 1 });
ConversationSchema.index({ tenantId: 1, lastMessageAt: -1 });

export const ConversationModel = mongoose.model<IConversationDocument>('Conversation', ConversationSchema);
