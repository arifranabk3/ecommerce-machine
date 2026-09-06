import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { RefundService } from '../services/refund.service';
import { PaymentWebhookService } from '../services/payment-webhook.service';
import { PaymentReconciliationService } from '../services/payment-reconciliation.service';
import { FinanceService } from '../services/finance.service';
import { PaymentModel } from '../models/Payment';
import { RefundModel } from '../models/Refund';
import { PaymentReconciliationModel } from '../models/PaymentReconciliation';
import { FinancialTransactionModel } from '../models/FinancialTransaction';
import { PaymentMethod } from '@sellzy/shared';

export class PaymentController {
  /**
   * POST /api/v1/payments
   */
  static async initiatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { orderId, customerId, method, provider, parentPaymentId, metadata } = req.body;

      if (!orderId || !method) {
        res.status(400).json({ error: 'Missing required fields: orderId and method are required.' });
        return;
      }

      const payment = await PaymentService.initiatePayment({
        tenantId,
        orderId,
        customerId,
        method: method as PaymentMethod,
        provider,
        parentPaymentId,
        metadata,
        createdBy: userId
      });

      res.status(201).json({ data: payment });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/payments
   */
  static async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { page = '1', limit = '20', status, method, provider, orderId } = req.query;

      const filter: any = { tenantId };
      if (status) filter.status = status;
      if (method) filter.method = method;
      if (provider) filter.provider = provider;
      if (orderId) filter.orderId = orderId;

      const p = Math.max(1, parseInt(page as string, 10));
      const l = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
      const skip = (p - 1) * l;

      const [data, total] = await Promise.all([
        PaymentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
        PaymentModel.countDocuments(filter)
      ]);

      res.status(200).json({
        data,
        pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/payments/:id
   */
  static async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const payment = await PaymentModel.findOne({ _id: id, tenantId });
      if (!payment) {
        res.status(404).json({ error: `Payment not found for ID ${id}` });
        return;
      }

      res.status(200).json({ data: payment });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/payments/:id/capture
   */
  static async capturePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const payment = await PaymentService.capturePayment(tenantId, id);
      res.status(200).json({ data: payment });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/payments/:id/cancel
   */
  static async cancelPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;
      const { reason } = req.body;

      const payment = await PaymentService.cancelPayment(tenantId, id, reason);
      res.status(200).json({ data: payment });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/payments/webhooks/:provider
   */
  static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider } = req.params;
      const headers = req.headers as Record<string, string>;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const result = await PaymentWebhookService.processWebhook({
        provider,
        headers,
        rawBody
      });

      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/refunds
   */
  static async getRefunds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { page = '1', limit = '20', paymentId, status } = req.query;

      const filter: any = { tenantId };
      if (paymentId) filter.paymentId = paymentId;
      if (status) filter.status = status;

      const p = Math.max(1, parseInt(page as string, 10));
      const l = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
      const skip = (p - 1) * l;

      const [data, total] = await Promise.all([
        RefundModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
        RefundModel.countDocuments(filter)
      ]);

      res.status(200).json({
        data,
        pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/refunds
   */
  static async requestRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { paymentId, amountMinor, reason, idempotencyKey } = req.body;

      if (!paymentId || amountMinor === undefined || !reason) {
        res.status(400).json({ error: 'Missing required fields: paymentId, amountMinor, and reason are required.' });
        return;
      }

      const refund = await RefundService.requestRefund({
        tenantId,
        paymentId,
        amountMinor,
        reason,
        idempotencyKey,
        createdBy: userId
      });

      res.status(201).json({ data: refund });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/refunds/:id/process
   */
  static async processRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { id } = req.params;

      const refund = await RefundService.processRefund(tenantId, id, userId);
      res.status(200).json({ data: refund });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/payments/reconciliation
   */
  static async getReconciliations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { status } = req.query;

      const filter: any = { tenantId };
      if (status) filter.status = status;

      const data = await PaymentReconciliationModel.find(filter).sort({ createdAt: -1 }).exec();
      res.status(200).json({ data });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/payments/reconciliation/:id/resolve
   */
  static async resolveReconciliation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { id } = req.params;
      const { notes } = req.body;

      if (!notes) {
        res.status(400).json({ error: 'Notes are required to resolve a reconciliation mismatch.' });
        return;
      }

      const record = await PaymentReconciliationService.resolveMismatch(tenantId, id, notes, userId);
      res.status(200).json({ data: record });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/finance
   */
  static async getFinanceSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const summary = await FinanceService.getSummary(tenantId);
      res.status(200).json({ data: summary });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/finance/transactions
   */
  static async getFinancialTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const { page = '1', limit = '20', type } = req.query;

      const filter: any = { tenantId };
      if (type) filter.type = type;

      const p = Math.max(1, parseInt(page as string, 10));
      const l = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
      const skip = (p - 1) * l;

      const [data, total] = await Promise.all([
        FinancialTransactionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
        FinancialTransactionModel.countDocuments(filter)
      ]);

      res.status(200).json({
        data,
        pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/v1/payments/cod
   */
  static async getCODOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const codPayments = await PaymentModel.find({ tenantId, method: PaymentMethod.COD }).sort({ createdAt: -1 });

      let pendingMinor = 0;
      let collectedMinor = 0;

      for (const p of codPayments) {
        if (p.status === 'CAPTURED') {
          collectedMinor += p.amountMinor;
        } else {
          pendingMinor += p.amountMinor;
        }
      }

      res.status(200).json({
        data: {
          pendingMinor,
          collectedMinor,
          totalCount: codPayments.length,
          payments: codPayments
        }
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/v1/payments/cod/:id/collect
   */
  static async collectCOD(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || (req as any).userId;
      const { id } = req.params;

      const payment = await PaymentService.collectCOD(tenantId, id, userId);
      res.status(200).json({ data: payment });
    } catch (err: any) {
      next(err);
    }
  }
}
