import { Request, Response } from 'express';
import { AutomationWorkflowModel } from '../models/AutomationWorkflow';
import { AutomationRunModel } from '../models/AutomationRun';
import { KillSwitchService } from '../services/KillSwitchService';
import { WorkflowEngine } from '../services/WorkflowEngine';
import { AutomationWorkflowStatus, AutomationMode } from '@sellzy/shared';

export class AutomationController {
  public static async createWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || 'system';
      const { name, description, trigger, conditions, actions, mode, priority } = req.body;

      if (!name || !trigger) {
        res.status(400).json({ error: 'name and trigger are required' });
        return;
      }

      const workflow = await AutomationWorkflowModel.create({
        tenantId,
        name,
        description,
        trigger,
        conditions: conditions || [],
        actions: actions || [],
        mode: mode || AutomationMode.AUTO,
        priority: priority || 0,
        status: AutomationWorkflowStatus.ACTIVE,
        enabled: true,
        createdBy: userId
      });

      res.status(201).json(workflow);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async getWorkflows(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const workflows = await AutomationWorkflowModel.find({ tenantId }).sort({ createdAt: -1 });
      res.status(200).json({ workflows, total: workflows.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async getWorkflowById(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const workflow = await AutomationWorkflowModel.findOne({ _id: id, tenantId });
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.status(200).json(workflow);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async updateWorkflowStatus(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const { status, enabled } = req.body;

      const workflow = await AutomationWorkflowModel.findOne({ _id: id, tenantId });
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }

      if (status) workflow.status = status;
      if (enabled !== undefined) workflow.enabled = enabled;
      await workflow.save();

      res.status(200).json(workflow);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async getWorkflowRuns(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const runs = await AutomationRunModel.find({ tenantId }).sort({ createdAt: -1 });
      res.status(200).json({ runs, total: runs.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async toggleKillSwitch(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { scope, targetId, disabled } = req.body;

      if (scope === 'GLOBAL') {
        KillSwitchService.setGlobalKillSwitch(!!disabled);
      } else if (scope === 'TENANT') {
        KillSwitchService.setTenantKillSwitch(targetId || tenantId, !!disabled);
      } else if (scope === 'WORKFLOW') {
        KillSwitchService.setWorkflowKillSwitch(targetId, !!disabled);
      } else if (scope === 'ACTION') {
        KillSwitchService.setActionKillSwitch(targetId, !!disabled);
      }

      res.status(200).json({ success: true, scope, disabled: !!disabled });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async executeTrigger(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { trigger, eventId, payload } = req.body;

      if (!trigger || !eventId) {
        res.status(400).json({ error: 'trigger and eventId are required' });
        return;
      }

      const result = await WorkflowEngine.handleEvent({
        tenantId,
        trigger,
        triggerEventId: eventId,
        eventPayload: payload || {},
        correlationId: `req_${Date.now()}`
      });

      res.status(200).json({ success: true, runs: result.runs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
