import { Request, Response } from 'express';
import { ExceptionManager } from '../services/ExceptionManager';

export class ExceptionController {
  public static async getExceptions(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { status, severity, category } = req.query;

      const list = await ExceptionManager.getExceptions(tenantId, {
        status: status as any,
        severity: severity as any,
        category: category as any
      });

      res.status(200).json({ exceptions: list, total: list.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const exception = await ExceptionManager.getExceptionById(tenantId, id);
      if (!exception) {
        res.status(404).json({ error: 'Automation exception not found' });
        return;
      }
      res.status(200).json(exception);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async resolve(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId || 'admin';
      const { id } = req.params;
      const { resolution } = req.body;

      const exception = await ExceptionManager.resolveException(tenantId, id, userId, resolution || 'Resolved manually');
      res.status(200).json(exception);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const { status } = req.body;

      const exception = await ExceptionManager.updateStatus(tenantId, id, status);
      res.status(200).json(exception);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
