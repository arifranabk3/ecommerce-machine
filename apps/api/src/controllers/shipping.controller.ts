import { Request, Response, NextFunction } from 'express';
import { ShipmentService } from '../services/shipment.service';
import { ReturnService } from '../services/return.service';
import { RTOService } from '../services/rto.service';
import { ShippingWebhookService } from '../services/shipping-webhook.service';
import { ShipmentModel } from '../models/Shipment';
import { CustomerReturnModel } from '../models/CustomerReturn';
import { ReturnToOriginModel } from '../models/ReturnToOrigin';
import { CourierModel } from '../models/Courier';
import { ShipmentExceptionModel } from '../models/ShipmentException';

export class ShippingController {
  // POST /api/v1/shipping/shipments
  static async createShipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { orderId, fulfillmentId, courierId, items, shippingCostMinor, codAmountMinor, packageCount } = req.body;

      if (!orderId || !courierId || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Missing required fields: orderId, courierId, and items array are required.' });
        return;
      }

      const shipment = await ShipmentService.createShipment({
        tenantId,
        orderId,
        fulfillmentId,
        courierId,
        items,
        shippingCostMinor,
        codAmountMinor,
        packageCount,
        createdBy: userId
      });

      res.status(201).json({ data: shipment });
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/v1/shipping/shipments
  static async getShipments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { page = '1', limit = '20', status, courierId, orderId } = req.query;

      const filter: any = { tenantId };
      if (status) filter.status = status;
      if (courierId) filter.courierId = courierId;
      if (orderId) filter.orderId = orderId;

      const p = Math.max(1, parseInt(page as string, 10));
      const l = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
      const skip = (p - 1) * l;

      const [data, total] = await Promise.all([
        ShipmentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
        ShipmentModel.countDocuments(filter)
      ]);

      res.status(200).json({
        data,
        pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
      });
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/v1/shipping/shipments/:id
  static async getShipmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const shipment = await ShipmentModel.findOne({ _id: id, tenantId });
      if (!shipment) {
        res.status(404).json({ error: 'Shipment not found' });
        return;
      }

      res.status(200).json({ data: shipment });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/shipping/shipments/:id/cancel
  static async cancelShipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const { reason } = req.body;

      const shipment = await ShipmentService.cancelShipment(tenantId, id, reason);
      res.status(200).json({ data: shipment });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/shipping/webhooks/:courier
  static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courier } = req.params;
      if (courier !== 'mock' && courier !== 'fedex' && courier !== 'dhl' && courier !== 'tcs' && courier !== 'leopard') {
        res.status(404).json({ error: `Unsupported courier provider: ${courier}` });
        return;
      }

      const headers = req.headers as Record<string, string>;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const result = await ShippingWebhookService.processWebhook({
        courier,
        headers,
        rawBody
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/v1/returns
  static async getReturns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { page = '1', limit = '20', status, orderId } = req.query;

      const filter: any = { tenantId };
      if (status) filter.status = status;
      if (orderId) filter.orderId = orderId;

      const p = Math.max(1, parseInt(page as string, 10));
      const l = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
      const skip = (p - 1) * l;

      const [data, total] = await Promise.all([
        CustomerReturnModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
        CustomerReturnModel.countDocuments(filter)
      ]);

      res.status(200).json({
        data,
        pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
      });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/returns
  static async requestReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { orderId, customerId, reason, customerNotes, items } = req.body;

      if (!orderId || !customerId || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Missing required fields: orderId, customerId, and items are required.' });
        return;
      }

      const ret = await ReturnService.requestReturn({
        tenantId,
        orderId,
        customerId,
        reason,
        customerNotes,
        items
      });

      res.status(201).json({ data: ret });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/returns/:id/approve
  static async approveReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { id } = req.params;

      const ret = await ReturnService.approveReturn(tenantId, id, userId);
      res.status(200).json({ data: ret });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/returns/:id/inspect
  static async inspectReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { id } = req.params;
      const { inspections } = req.body;

      if (!inspections || !Array.isArray(inspections)) {
        res.status(400).json({ error: 'Inspections array is required.' });
        return;
      }

      const ret = await ReturnService.inspectAndReceiveReturn(tenantId, id, inspections, userId);
      res.status(200).json({ data: ret });
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/v1/shipping/rto
  static async getRTOList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const data = await ReturnToOriginModel.find({ tenantId }).sort({ createdAt: -1 });
      res.status(200).json({ data });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/shipping/rto
  static async initiateRTO(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { shipmentId, reason, notes } = req.body;

      if (!shipmentId || !reason) {
        res.status(400).json({ error: 'Missing required fields: shipmentId and reason are required.' });
        return;
      }

      const rto = await RTOService.initiateRTO({ tenantId, shipmentId, reason, notes });
      res.status(201).json({ data: rto });
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/v1/settings/couriers
  static async getCouriers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const couriers = await CourierModel.find({ tenantId }).sort({ createdAt: -1 });
      res.status(200).json({ data: couriers });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/v1/settings/couriers
  static async createCourier(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { courierCode, name, type, configuration } = req.body;

      if (!courierCode || !name) {
        res.status(400).json({ error: 'courierCode and name are required.' });
        return;
      }

      const existing = await CourierModel.findOne({ tenantId, courierCode });
      if (existing) {
        res.status(400).json({ error: `Courier with code '${courierCode}' already exists.` });
        return;
      }

      const courier = new CourierModel({
        tenantId,
        courierCode,
        name,
        type: type || 'API',
        configuration
      });

      await courier.save();
      res.status(201).json({ data: courier });
    } catch (err: any) {
      next(err);
    }
  }
}
