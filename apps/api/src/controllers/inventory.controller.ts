import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { InventoryService } from '../services/inventory.service';
import {
  stockAdjustmentSchema,
  stockTransferSchema,
  inventoryReservationSchema
} from '@sellzy/validation';

export class InventoryController {
  static async adjustStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = stockAdjustmentSchema.parse(req.body);
      const result = await InventoryService.adjustStock(tenantId, { ...input, warehouseId: input.locationId }, actorUserId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async transferStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = stockTransferSchema.parse(req.body);
      const result = await InventoryService.transferStock(tenantId, { ...input, fromWarehouseId: input.fromLocationId, toWarehouseId: input.toLocationId }, actorUserId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async reserveStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = inventoryReservationSchema.parse(req.body);
      const result = await InventoryService.reserveStock(tenantId, { ...input, warehouseId: input.locationId }, actorUserId);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async releaseReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const reservationId = req.params.reservationId;
      const result = await InventoryService.releaseReservation(tenantId, reservationId, actorUserId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getInventoryByLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const warehouseId = req.params.locationId;
      const items = await InventoryService.getInventoryByLocation(tenantId, warehouseId);
      return res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  static async getMovements(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const productId = req.query.productId as string;
      const locationId = req.query.locationId as string;

      const result = await InventoryService.getInventoryMovements(tenantId, {
        productId,
        warehouseId: locationId,
        page,
        limit
      });

      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async getLowStockAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const alerts = await InventoryService.getLowStockAlerts(tenantId);
      return res.json({ success: true, data: alerts });
    } catch (err) {
      next(err);
    }
  }
}
