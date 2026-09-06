import mongoose, { Schema, Document } from 'mongoose';
import { ApprovalRequestStatus, RiskLevel, IApprovalRequest } from '@sellzy/shared';

export interface IApprovalRequestDocument extends Omit<IApprovalRequest, 'id'>, Document {}

const ApprovalRequestSchema = new Schema<IApprovalRequestDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    workflowRunId: { type: String, index: true },
    actionType: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true, index: true },
    requestedBy: { type: String, required: true },
    riskLevel: { type: String, enum: Object.values(RiskLevel), default: RiskLevel.MEDIUM },
    reason: { type: String, required: true },
    proposedAction: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: Object.values(ApprovalRequestStatus), default: ApprovalRequestStatus.PENDING, index: true },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    rejectedBy: { type: String },
    rejectedAt: { type: Date },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

ApprovalRequestSchema.index({ tenantId: 1, status: 1 });
ApprovalRequestSchema.index({ tenantId: 1, resourceType: 1, resourceId: 1 });

export const ApprovalRequestModel = mongoose.model<IApprovalRequestDocument>('ApprovalRequest', ApprovalRequestSchema);
