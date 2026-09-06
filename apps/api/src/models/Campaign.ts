import mongoose, { Schema, Document } from 'mongoose';
import { ICampaign, CommunicationChannel, CampaignStatus } from '@sellzy/shared';

export interface ICampaignDocument extends Omit<ICampaign, 'id'>, Document {
  subject?: string;
  content?: string;
  metrics: {
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
  };
}

const CampaignSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    channel: { type: String, enum: Object.values(CommunicationChannel), required: true, index: true },
    audienceFilter: { type: Schema.Types.Mixed },
    templateId: { type: String, index: true },
    subject: { type: String },
    content: { type: String },
    status: { type: String, enum: Object.values(CampaignStatus), default: CampaignStatus.DRAFT, required: true, index: true },
    scheduledAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    createdBy: { type: String, default: 'system', required: true },
    approvedBy: { type: String },
    statistics: {
      totalRecipients: { type: Number, default: 0 },
      sentCount: { type: Number, default: 0 },
      deliveredCount: { type: Number, default: 0 },
      readCount: { type: Number, default: 0 },
      failedCount: { type: Number, default: 0 }
    },
    idempotencyKey: { type: String, index: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CampaignSchema.virtual('metrics').get(function (this: any) {
  if (!this.statistics) {
    this.statistics = { totalRecipients: 0, sentCount: 0, deliveredCount: 0, readCount: 0, failedCount: 0 };
  }
  return this.statistics;
}).set(function (this: any, val: any) {
  this.statistics = val;
});

CampaignSchema.index({ tenantId: 1, status: 1 });
CampaignSchema.index({ tenantId: 1, scheduledAt: 1 });
CampaignSchema.index({ tenantId: 1, idempotencyKey: 1 }, { unique: true, sparse: true });

export const CampaignModel = mongoose.model<ICampaignDocument>('Campaign', CampaignSchema);
