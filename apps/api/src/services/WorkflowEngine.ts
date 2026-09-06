import { AutomationWorkflowModel, IAutomationWorkflowDocument } from '../models/AutomationWorkflow';
import { AutomationRunModel, IAutomationRunDocument } from '../models/AutomationRun';
import { AutomationWorkflowStatus, AutomationRunStatus, AutomationMode } from '@sellzy/shared';
import { RulesEngine } from './RulesEngine';
import { ActionRegistry } from './ActionRegistry';
import { ApprovalEngine } from './ApprovalEngine';
import { ExceptionManager } from './ExceptionManager';
import { KillSwitchService } from './KillSwitchService';
import { logger } from '../utils/logger';

export interface IExecuteWorkflowParams {
  tenantId: string;
  trigger: string;
  triggerEventId: string;
  eventPayload: Record<string, any>;
  correlationId: string;
  causationId?: string;
  depth?: number;
}

export class WorkflowEngine {
  private static MAX_RECURSION_DEPTH = 5;

  public static async handleEvent(params: IExecuteWorkflowParams): Promise<{ runs: IAutomationRunDocument[] }> {
    const { tenantId, trigger, triggerEventId, eventPayload, correlationId, depth = 0 } = params;

    // Loop & Recursion Protection
    if (depth >= this.MAX_RECURSION_DEPTH) {
      logger.warn({ tenantId, trigger, correlationId, depth }, 'WorkflowEngine: Maximum recursion depth reached. Halting execution loop.');
      return { runs: [] };
    }

    // Kill Switch Check
    const killSwitch = KillSwitchService.isExecutionAllowed(tenantId);
    if (!killSwitch.allowed) {
      logger.warn({ tenantId, reason: killSwitch.reason }, 'WorkflowEngine: Execution blocked by kill switch');
      return { runs: [] };
    }

    // Query active workflows for this trigger & tenant
    const workflows = await AutomationWorkflowModel.find({
      tenantId,
      trigger,
      status: AutomationWorkflowStatus.ACTIVE,
      enabled: true
    }).sort({ priority: -1 });

    const runs: IAutomationRunDocument[] = [];

    for (const workflow of workflows) {
      const run = await this.executeWorkflowInstance({
        workflow,
        triggerEventId,
        eventPayload,
        correlationId,
        depth
      });
      if (run) runs.push(run);
    }

    return { runs };
  }

  public static async executeWorkflowInstance(params: {
    workflow: IAutomationWorkflowDocument;
    triggerEventId: string;
    eventPayload: Record<string, any>;
    correlationId: string;
    depth: number;
  }): Promise<IAutomationRunDocument | null> {
    const { workflow, triggerEventId, eventPayload, correlationId } = params;
    const { tenantId, _id: workflowId, version, conditions, actions, mode } = workflow;

    // Idempotent AutomationRun creation: tenantId + workflowId + triggerEventId
    let run: IAutomationRunDocument;
    try {
      run = await AutomationRunModel.create({
        tenantId,
        workflowId: workflowId.toString(),
        workflowVersion: version,
        triggerEventId,
        status: AutomationRunStatus.RUNNING,
        startedAt: new Date(),
        correlationId,
        currentStep: 0,
        decision: { conditionsEvaluated: false, matched: false }
      });
    } catch (err: any) {
      if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
        logger.info({ tenantId, workflowId, triggerEventId }, 'WorkflowEngine: Duplicate workflow run request caught by compound unique index');
        return AutomationRunModel.findOne({ tenantId, workflowId: workflowId.toString(), triggerEventId });
      }
      throw err;
    }

    // Evaluate conditions using deterministic RulesEngine
    const matched = RulesEngine.evaluate(conditions || [], eventPayload);
    run.decision = { conditionsEvaluated: true, matched };

    if (!matched) {
      run.status = AutomationRunStatus.COMPLETED;
      run.completedAt = new Date();
      await run.save();
      return run;
    }

    // Check if workflow or action kill switch active
    const wfKill = KillSwitchService.isExecutionAllowed(tenantId, workflowId.toString());
    if (!wfKill.allowed) {
      run.status = AutomationRunStatus.FAILED;
      run.error = wfKill.reason;
      run.completedAt = new Date();
      await run.save();
      return run;
    }

    const actionResults: any[] = [];

    for (let i = 0; i < actions.length; i++) {
      const actionConfig = actions[i];
      run.currentStep = i + 1;

      const effectiveMode = actionConfig.mode || mode || AutomationMode.AUTO;
      const isFinancialHighRisk = ActionRegistry.isFinancialHighRisk(actionConfig.actionType);

      // APPROVAL mode or financial high-risk action -> Require Approval
      if (effectiveMode === AutomationMode.APPROVAL || isFinancialHighRisk) {
        await ApprovalEngine.createApprovalRequest({
          tenantId,
          workflowRunId: run._id.toString(),
          actionType: actionConfig.actionType,
          resourceType: 'WORKFLOW_ACTION',
          resourceId: `${run._id}_step_${i}`,
          requestedBy: `workflow:${workflowId}`,
          reason: `Approval required for action ${actionConfig.actionType} in mode ${effectiveMode}`,
          proposedAction: actionConfig.params
        });

        run.status = AutomationRunStatus.WAITING_APPROVAL;
        actionResults.push({ step: i, actionType: actionConfig.actionType, status: 'WAITING_APPROVAL' });
        run.actionResults = actionResults;
        await run.save();
        return run;
      }

      // ESCALATION mode -> Stop and create Exception
      if (effectiveMode === AutomationMode.ESCALATION) {
        await ExceptionManager.createException({
          tenantId,
          workflowRunId: run._id.toString(),
          category: 'WORKFLOW_ESCALATION',
          title: `Escalation for workflow ${workflow.name}`,
          description: `Workflow ${workflow.name} triggered action ${actionConfig.actionType} requiring human escalation`,
          recommendedAction: `Review workflow run ${run._id} and resolve manually`
        });

        run.status = AutomationRunStatus.ESCALATED;
        actionResults.push({ step: i, actionType: actionConfig.actionType, status: 'ESCALATED' });
        run.actionResults = actionResults;
        run.completedAt = new Date();
        await run.save();
        return run;
      }

      // AUTO mode -> Execute registered action
      const actionMeta = ActionRegistry.get(actionConfig.actionType);
      if (!actionMeta) {
        run.status = AutomationRunStatus.FAILED;
        run.error = `Action type '${actionConfig.actionType}' is not registered`;
        actionResults.push({ step: i, actionType: actionConfig.actionType, status: 'FAILED', error: run.error });
        run.actionResults = actionResults;
        run.completedAt = new Date();
        await run.save();
        return run;
      }

      try {
        const result = await actionMeta.handler(tenantId, actionConfig.params, { workflowId, runId: run._id });
        actionResults.push({ step: i, actionType: actionConfig.actionType, status: 'COMPLETED', result });
      } catch (actErr: any) {
        run.status = AutomationRunStatus.FAILED;
        run.error = actErr.message || 'Action execution error';
        actionResults.push({ step: i, actionType: actionConfig.actionType, status: 'FAILED', error: run.error });
        run.actionResults = actionResults;
        run.completedAt = new Date();
        await run.save();
        return run;
      }
    }

    run.status = AutomationRunStatus.COMPLETED;
    run.actionResults = actionResults;
    run.completedAt = new Date();
    await run.save();
    return run;
  }
}
