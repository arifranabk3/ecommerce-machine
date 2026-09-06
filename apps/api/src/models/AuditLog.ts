import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLogDocument extends Document {
  tenantId: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  source: string;
  metadata?: Record<string, unknown>;
  result: 'SUCCESS' | 'FAILURE';
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLogDocument>({
  tenantId: { type: String, required: true, index: true },
  actorUserId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  before: { type: Object },
  after: { type: Object },
  source: { type: String, required: true, default: 'API' },
  metadata: { type: Object },
  result: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
  timestamp: { type: Date, default: Date.now, index: true }
});

auditLogSchema.index({ tenantId: 1, timestamp: -1 });
auditLogSchema.index({ tenantId: 1, actorUserId: 1 });
auditLogSchema.index({ tenantId: 1, resourceType: 1, resourceId: 1 });

export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', auditLogSchema);
