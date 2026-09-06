import { Request, Response } from 'express';
import { ApprovalEngine } from '../services/ApprovalEngine';

export class ApprovalController {
  public static async getPending(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const list = await ApprovalEngine.getPendingApprovals(tenantId);
      res.status(200).json({ approvals: list, total: list.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const approval = await ApprovalEngine.getApprovalById(tenantId, id);
      if (!approval) {
        res.status(404).json({ error: 'Approval request not found' });
        return;
      }
      res.status(200).json(approval);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async approve(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || 'admin';
      const { id } = req.params;

      const approval = await ApprovalEngine.approveRequest(tenantId, id, userId);
      res.status(200).json(approval);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static async reject(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || 'admin';
      const { id } = req.params;
      const { reason } = req.body;

      const approval = await ApprovalEngine.rejectRequest(tenantId, id, userId, reason);
      res.status(200).json(approval);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
