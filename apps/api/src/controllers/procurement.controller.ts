import { Request, Response } from 'express';
import { ProcurementService } from '../services/procurement.service';
import { createPurchaseOrderSchema, poTransitionSchema, autoProcurementSchema } from '@sellzy/validation';
import { PurchaseOrderStatus } from '@sellzy/shared';

export class ProcurementController {
  static async createPurchaseOrder(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'Staff User';
      const validatedInput = createPurchaseOrderSchema.parse(req.body);

      const po = await ProcurementService.createPurchaseOrder(tenantId, validatedInput, userId, userName);
      return res.status(201).json({ success: true, data: po });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async getPurchaseOrders(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const result = await ProcurementService.getPurchaseOrders(tenantId, req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getPurchaseOrderById(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const poData = await ProcurementService.getPurchaseOrderById(tenantId, id);

      if (!poData) {
        return res.status(404).json({ success: false, error: 'Purchase order not found' });
      }

      return res.status(200).json({ success: true, data: poData });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async transitionStatus(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'Staff User';
      const { id } = req.params;
      const { targetStatus, reason } = poTransitionSchema.parse(req.body);

      const po = await ProcurementService.transitionStatus(tenantId, id, targetStatus as PurchaseOrderStatus, userId, userName, reason);
      return res.status(200).json({ success: true, data: po });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async receiveGoods(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'Staff User';
      const { id, itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || Number(quantity) <= 0) {
        return res.status(400).json({ success: false, error: 'Valid received quantity is required' });
      }

      const result = await ProcurementService.receiveGoods(tenantId, id, itemId, Number(quantity), userId, userName);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async autoProcurement(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'Staff User';
      const { mode, salesOrderId, locationId } = autoProcurementSchema.parse(req.body);

      if (mode === 'ORDER_SPLIT') {
        if (!salesOrderId) return res.status(400).json({ success: false, error: 'salesOrderId required for ORDER_SPLIT mode' });
        const pos = await ProcurementService.splitOrderToProcurement(tenantId, salesOrderId, userId, userName);
        return res.status(200).json({ success: true, data: pos });
      } else {
        if (!locationId) return res.status(400).json({ success: false, error: 'locationId required for LOW_STOCK mode' });
        const pos = await ProcurementService.evaluateLowStockProcurement(tenantId, locationId, userId, userName);
        return res.status(200).json({ success: true, data: pos });
      }
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }
}
