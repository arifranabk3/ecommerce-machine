import { AutomationExceptionModel, IAutomationExceptionDocument } from '../models/AutomationException';
import { AutomationExceptionSeverity, AutomationExceptionStatus } from '@sellzy/shared';

export interface ICreateExceptionParams {
  tenantId: string;
  workflowRunId?: string;
  severity?: AutomationExceptionSeverity;
  category: string;
  title: string;
  description: string;
  resourceType?: string;
  resourceId?: string;
  recommendedAction?: string;
  assignedTo?: string;
}

export class ExceptionManager {
  public static async createException(params: ICreateExceptionParams): Promise<IAutomationExceptionDocument> {
    return AutomationExceptionModel.create({
      ...params,
      severity: params.severity || AutomationExceptionSeverity.MEDIUM,
      status: AutomationExceptionStatus.OPEN
    });
  }

  public static async resolveException(tenantId: string, exceptionId: string, resolvedBy: string, resolution: string): Promise<IAutomationExceptionDocument> {
    const updated = await AutomationExceptionModel.findOneAndUpdate(
      { _id: exceptionId, tenantId },
      {
        $set: {
          status: AutomationExceptionStatus.RESOLVED,
          resolvedBy,
          resolvedAt: new Date(),
          resolution
        }
      },
      { new: true }
    );
    if (!updated) {
      throw new Error(`Automation exception ${exceptionId} not found for tenant ${tenantId}`);
    }
    return updated;
  }

  public static async updateStatus(tenantId: string, exceptionId: string, status: AutomationExceptionStatus): Promise<IAutomationExceptionDocument> {
    const updated = await AutomationExceptionModel.findOneAndUpdate(
      { _id: exceptionId, tenantId },
      { $set: { status } },
      { new: true }
    );
    if (!updated) {
      throw new Error(`Automation exception ${exceptionId} not found for tenant ${tenantId}`);
    }
    return updated;
  }

  public static async getExceptions(tenantId: string, filters?: { status?: AutomationExceptionStatus; severity?: AutomationExceptionSeverity; category?: string }) {
    const query: any = { tenantId };
    if (filters?.status) query.status = filters.status;
    if (filters?.severity) query.severity = filters.severity;
    if (filters?.category) query.category = filters.category;
    return AutomationExceptionModel.find(query).sort({ createdAt: -1 });
  }

  public static async getExceptionById(tenantId: string, exceptionId: string): Promise<IAutomationExceptionDocument | null> {
    return AutomationExceptionModel.findOne({ _id: exceptionId, tenantId });
  }
}
