import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrderService } from '../services/order.service';
import { FulfillmentService } from '../services/fulfillment.service';
import {
  createOrderSchema,
  updateOrderSchema,
  orderTransitionSchema,
  createOrderNoteSchema,
  updateFulfillmentSchema
} from '@sellzy/validation';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '@sellzy/shared';

export class OrderController {
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = createOrderSchema.parse(req.body);
      const result = await OrderService.createOrder(tenantId, input, actorUserId);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const orderId = req.params.id;
      const result = await OrderService.getOrderById(tenantId, orderId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as OrderStatus;
      const paymentStatus = req.query.paymentStatus as PaymentStatus;
      const fulfillmentStatus = req.query.fulfillmentStatus as FulfillmentStatus;
      const source = req.query.source as string;
      const search = req.query.search as string;

      const result = await OrderService.listOrders(tenantId, {
        page,
        limit,
        status,
        paymentStatus,
        fulfillmentStatus,
        source,
        search
      });

      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async updateOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const input = updateOrderSchema.parse(req.body);
      const order = await OrderService.updateOrder(tenantId, orderId, input, actorUserId);
      return res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  static async transitionStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const { targetStatus, reason } = orderTransitionSchema.parse(req.body);

      const order = await OrderService.transitionOrderStatus(tenantId, orderId, targetStatus as OrderStatus, reason, actorUserId);
      return res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  static async confirmOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const order = await OrderService.transitionOrderStatus(tenantId, orderId, OrderStatus.CONFIRMED, 'Order confirmed', actorUserId);
      return res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  static async processOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const order = await OrderService.transitionOrderStatus(tenantId, orderId, OrderStatus.PROCESSING, 'Order processing started', actorUserId);
      return res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  static async holdOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const { reason } = req.body;
      const order = await OrderService.transitionOrderStatus(tenantId, orderId, OrderStatus.ON_HOLD, reason || 'Order placed on hold', actorUserId);
      return res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  static async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const { reason } = req.body;
      const order = await OrderService.transitionOrderStatus(tenantId, orderId, OrderStatus.CANCELLED, reason || 'Order cancelled', actorUserId);
      return res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  static async updateFulfillment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const orderId = req.params.id;
      const input = updateFulfillmentSchema.parse(req.body);
      const fulfillment = await FulfillmentService.updateFulfillment(tenantId, orderId, input, actorUserId);
      return res.json({ success: true, data: fulfillment });
    } catch (err) {
      next(err);
    }
  }

  static async addOrderNote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const authorUserId = req.user!.userId;
      const orderId = req.params.id;
      const input = createOrderNoteSchema.parse(req.body);
      const note = await OrderService.addOrderNote(tenantId, orderId, input, authorUserId);
      return res.status(201).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  }

  static async listFulfillments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as FulfillmentStatus;

      const result = await FulfillmentService.listFulfillments(tenantId, { page, limit, status });
      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
