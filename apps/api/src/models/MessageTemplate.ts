import mongoose, { Schema, Document } from 'mongoose';
import { IMessageTemplate, CommunicationChannel, MessageTemplateCategory, MessageTemplateStatus } from '@sellzy/shared';

export interface IMessageTemplateDocument extends Omit<IMessageTemplate, 'id'>, Document {
  content: string;
  rejectionReason?: string;
}

const MessageTemplateSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    channel: { type: String, enum: Object.values(CommunicationChannel), required: true, index: true },
    providerTemplateId: { type: String },
    language: { type: String, default: 'en', required: true },
    category: { type: String, enum: Object.values(MessageTemplateCategory), default: MessageTemplateCategory.UTILITY, required: true },
    status: { type: String, enum: Object.values(MessageTemplateStatus), default: MessageTemplateStatus.DRAFT, required: true, index: true },
    body: { type: String, required: true },
    subject: { type: String },
    variables: [{ type: String }],
    header: { type: String },
    footer: { type: String },
    buttons: [
      {
        type: { type: String, required: true },
        text: { type: String, required: true },
        url: { type: String },
        phone: { type: String }
      }
    ],
    rejectionReason: { type: String },
    version: { type: Number, default: 1, required: true },
    active: { type: Boolean, default: true, required: true },
    createdBy: { type: String, default: 'system', required: true },
    approvedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

MessageTemplateSchema.virtual('content').get(function (this: any) {
  return this.body;
}).set(function (this: any, val: string) {
  this.body = val;
});

MessageTemplateSchema.index({ tenantId: 1, name: 1, language: 1 }, { unique: true });
MessageTemplateSchema.index({ tenantId: 1, status: 1 });

export const MessageTemplateModel = mongoose.model<IMessageTemplateDocument>('MessageTemplate', MessageTemplateSchema);
