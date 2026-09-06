import mongoose, { Schema, Document } from 'mongoose';
import { ICommunicationPreference } from '@sellzy/shared';

export interface ICommunicationPreferenceDocument extends Omit<ICommunicationPreference, 'id'>, Document {
  channels: { whatsapp: boolean; email: boolean; sms: boolean };
  topics: { promotions: boolean; newsletter: boolean; orderUpdates: boolean };
  auditTrail: Array<{ updatedAt: Date; action: string; channels?: any; topics?: any; ipAddress?: string; userAgent?: string; reason?: string }>;
}

const CommunicationPreferenceSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    whatsapp: { type: Boolean, default: false, required: true },
    email: { type: Boolean, default: false, required: true },
    sms: { type: Boolean, default: false, required: true },
    marketingAllowed: { type: Boolean, default: false, required: true },
    transactionalAllowed: { type: Boolean, default: true, required: true },
    optInSource: { type: String },
    optInAt: { type: Date },
    optOutAt: { type: Date },
    unsubscribeReason: { type: String },
    topics: {
      promotions: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true }
    },
    auditTrail: [
      {
        updatedAt: { type: Date, default: Date.now },
        action: { type: String, required: true },
        channels: { type: Schema.Types.Mixed },
        topics: { type: Schema.Types.Mixed },
        ipAddress: { type: String },
        userAgent: { type: String },
        reason: { type: String }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CommunicationPreferenceSchema.virtual('channels').get(function (this: any) {
  return {
    whatsapp: this.whatsapp,
    email: this.email,
    sms: this.sms
  };
}).set(function (this: any, val: { whatsapp?: boolean; email?: boolean; sms?: boolean }) {
  if (val.whatsapp !== undefined) this.whatsapp = val.whatsapp;
  if (val.email !== undefined) this.email = val.email;
  if (val.sms !== undefined) this.sms = val.sms;
});

CommunicationPreferenceSchema.index({ tenantId: 1, customerId: 1 }, { unique: true });

export const CommunicationPreferenceModel = mongoose.model<ICommunicationPreferenceDocument>(
  'CommunicationPreference',
  CommunicationPreferenceSchema
);
