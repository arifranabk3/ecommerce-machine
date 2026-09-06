import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformAuditDocument extends Document {
  actorId: string;
  actorEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  tenantId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  result: 'SUCCESS' | 'FAILED';
  ipAddress?: string;
  createdAt: Date;
}

const PlatformAuditSchema = new Schema<IPlatformAuditDocument>(
  {
    actorId: { type: String, required: true, index: true },
    actorEmail: { type: String },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String },
    tenantId: { type: String, index: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    reason: { type: String },
    result: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
    ipAddress: { type: String }
  },
  { timestamps: true }
);

PlatformAuditSchema.index({ createdAt: -1 });

export const PlatformAuditModel =
  mongoose.models.PlatformAudit || mongoose.model<IPlatformAuditDocument>('PlatformAudit', PlatformAuditSchema);
