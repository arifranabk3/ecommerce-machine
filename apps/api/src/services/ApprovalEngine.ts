import { ApprovalRequestModel, IApprovalRequestDocument } from '../models/ApprovalRequest';
import { ApprovalRequestStatus, RiskLevel } from '@sellzy/shared';
import { logger } from '../utils/logger';

export interface ICreateApprovalRequestParams {
  tenantId: string;
  workflowRunId?: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  requestedBy: string;
  riskLevel?: RiskLevel;
  reason: string;
  proposedAction: Record<string, any>;
  expiresAt?: Date;
}

export class ApprovalEngine {
  public static async createApprovalRequest(params: ICreateApprovalRequestParams): Promise<IApprovalRequestDocument> {
    const existing = await ApprovalRequestModel.findOne({
      tenantId: params.tenantId,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      actionType: params.actionType,
      status: ApprovalRequestStatus.PENDING
    });
    if (existing) {
      return existing;
    }

    return ApprovalRequestModel.create({
      ...params,
      riskLevel: params.riskLevel || RiskLevel.MEDIUM,
      status: ApprovalRequestStatus.PENDING
    });
  }

  public static async approveRequest(tenantId: string, requestId: string, approvedBy: string): Promise<IApprovalRequestDocument> {
    // Atomic single-winner state transition from PENDING -> APPROVED
    const updated = await ApprovalRequestModel.findOneAndUpdate(
      { _id: requestId, tenantId, status: ApprovalRequestStatus.PENDING },
      {
        $set: {
          status: ApprovalRequestStatus.APPROVED,
          approvedBy,
          approvedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updated) {
      const current = await ApprovalRequestModel.findOne({ _id: requestId, tenantId });
      if (!current) {
        throw new Error(`Approval request ${requestId} not found for tenant ${tenantId}`);
      }
      throw new Error(`Approval request ${requestId} is already in state ${current.status}`);
    }

    logger.info({ tenantId, requestId, approvedBy }, 'Approval request APPROVED cleanly (single winner)');
    return updated;
  }

  public static async rejectRequest(tenantId: string, requestId: string, rejectedBy: string, reason?: string): Promise<IApprovalRequestDocument> {
    const updated = await ApprovalRequestModel.findOneAndUpdate(
      { _id: requestId, tenantId, status: ApprovalRequestStatus.PENDING },
      {
        $set: {
          status: ApprovalRequestStatus.REJECTED,
          rejectedBy,
          rejectedAt: new Date(),
          reason: reason ? `${reason}` : undefined
        }
      },
      { new: true }
    );

    if (!updated) {
      const current = await ApprovalRequestModel.findOne({ _id: requestId, tenantId });
      if (!current) {
        throw new Error(`Approval request ${requestId} not found for tenant ${tenantId}`);
      }
      throw new Error(`Approval request ${requestId} is already in state ${current.status}`);
    }

    logger.info({ tenantId, requestId, rejectedBy }, 'Approval request REJECTED cleanly (single winner)');
    return updated;
  }

  public static async getPendingApprovals(tenantId: string): Promise<IApprovalRequestDocument[]> {
    return ApprovalRequestModel.find({ tenantId, status: ApprovalRequestStatus.PENDING }).sort({ createdAt: -1 });
  }

  public static async getApprovalById(tenantId: string, requestId: string): Promise<IApprovalRequestDocument | null> {
    return ApprovalRequestModel.findOne({ _id: requestId, tenantId });
  }
}
