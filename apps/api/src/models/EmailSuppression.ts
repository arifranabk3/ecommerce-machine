import mongoose, { Schema, Document } from 'mongoose';
import { IEmailSuppression } from '@sellzy/shared';

export interface IEmailSuppressionDocument extends Omit<IEmailSuppression, 'id'>, Document {}

const EmailSuppressionSchema = new Schema<IEmailSuppressionDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    email: { type: String, required: true, trim: true },
    normalizedEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    reason: {
      type: String,
      enum: ['UNSUBSCRIBE', 'BOUNCE', 'COMPLAINT', 'MANUAL'],
      default: 'UNSUBSCRIBE',
      required: true
    },
    source: { type: String, trim: true },
    suppressedAt: { type: Date, default: Date.now, required: true }
  },
  {
    timestamps: true
  }
);

// Compound Unique Index: Prevents duplicate suppressions per tenant
EmailSuppressionSchema.index({ tenantId: 1, normalizedEmail: 1 }, { unique: true });

export const EmailSuppressionModel = mongoose.model<IEmailSuppressionDocument>('EmailSuppression', EmailSuppressionSchema);

