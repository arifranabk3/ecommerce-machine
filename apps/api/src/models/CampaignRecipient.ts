import mongoose, { Schema, Document } from 'mongoose';
import { ICampaignRecipient, CampaignRecipientStatus } from '@sellzy/shared';

export interface ICampaignRecipientDocument extends Omit<ICampaignRecipient, 'id'>, Document {
  errorMessage?: string;
}

const CampaignRecipientSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    campaignId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    destination: { type: String, default: 'customer' },
    personalizationSnapshot: { type: Schema.Types.Mixed },
    status: { type: String, enum: Object.values(CampaignRecipientStatus), default: CampaignRecipientStatus.QUEUED, required: true, index: true },
    messageId: { type: String, index: true },
    providerMessageId: { type: String, index: true },
    error: { type: String },
    errorMessage: { type: String },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    readAt: { type: Date }
  },
  {
    timestamps: true
  }
);

CampaignRecipientSchema.index({ tenantId: 1, campaignId: 1, customerId: 1 }, { unique: true });
CampaignRecipientSchema.index({ tenantId: 1, campaignId: 1, status: 1 });

export const CampaignRecipientModel = mongoose.model<ICampaignRecipientDocument>('CampaignRecipient', CampaignRecipientSchema);
