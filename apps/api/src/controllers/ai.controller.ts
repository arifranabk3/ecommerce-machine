import { Request, Response } from 'express';
import { AiCopilotService } from '../services/AiCopilotService';

export class AiController {
  public static async getDailyBrief(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const brief = await AiCopilotService.generateDailyBrief(tenantId);
      res.status(200).json(brief);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async classifyMessage(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { body } = req.body;
      if (!body) {
        res.status(400).json({ error: 'body is required' });
        return;
      }
      const result = await AiCopilotService.classifyMessage(tenantId, body);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async draftResponse(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { query } = req.body;
      if (!query) {
        res.status(400).json({ error: 'query is required' });
        return;
      }
      const result = await AiCopilotService.draftResponse(tenantId, query);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async executeTool(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userPermissions = (req as any).permissions || [];
      const { toolName, params } = req.body;

      if (!toolName) {
        res.status(400).json({ error: 'toolName is required' });
        return;
      }

      const result = await AiCopilotService.executeToolSafe(tenantId, toolName, params || {}, userPermissions);
      res.status(200).json({ success: true, result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
