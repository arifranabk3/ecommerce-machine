import { Request, Response } from 'express';
import { VendorLedgerService } from '../services/vendor-ledger.service';
import { VendorSettlementService } from '../services/vendor-settlement.service';
import { FinancialPeriodService } from '../services/financial-period.service';
import { VendorLedgerEntryModel } from '../models/VendorLedgerEntry';
import { VendorSettlementModel } from '../models/VendorSettlement';
import { VendorPaymentModel } from '../models/VendorPayment';
import { SettlementReconciliationModel } from '../models/SettlementReconciliation';

export class VendorLedgerController {
  static async getVendorLedger(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id: vendorId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const entries = await VendorLedgerEntryModel.find({ tenantId, vendorId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await VendorLedgerEntryModel.countDocuments({ tenantId, vendorId });
      const balance = await VendorLedgerService.getVendorBalance(tenantId, vendorId);

      return res.status(200).json({
        success: true,
        data: entries,
        balance,
        pagination: { total, page: Number(page), limit: Number(limit) }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getVendorBalance(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id: vendorId } = req.params;

      const balance = await VendorLedgerService.getVendorBalance(tenantId, vendorId);
      return res.status(200).json({ success: true, data: balance });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async adjustLedger(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { id: vendorId } = req.params;
      const { direction, amountMinor, reason } = req.body;

      if (!direction || !amountMinor || !reason) {
        return res.status(400).json({ success: false, error: 'direction, amountMinor, and reason are required' });
      }

      const entry = await VendorLedgerService.createAdjustment(
        tenantId,
        vendorId,
        direction,
        amountMinor,
        reason,
        userId
      );

      return res.status(201).json({ success: true, data: entry });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async reverseEntry(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { entryId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ success: false, error: 'Reversal reason is required' });
      }

      const result = await VendorLedgerService.reverseEntry(tenantId, entryId, reason, userId);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }
}

export class VendorSettlementController {
  static async calculateSettlement(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { vendorId, periodStart, periodEnd, currency } = req.body;

      if (!vendorId || !periodStart || !periodEnd) {
        return res.status(400).json({ success: false, error: 'vendorId, periodStart, and periodEnd are required' });
      }

      const settlement = await VendorSettlementService.calculateSettlement({
        tenantId,
        vendorId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        currency,
        createdBy: userId
      });

      return res.status(201).json({ success: true, data: settlement });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async getSettlements(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { status, vendorId } = req.query;

      const filter: any = { tenantId };
      if (status) filter.status = status;
      if (vendorId) filter.vendorId = vendorId;

      const settlements = await VendorSettlementModel.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: settlements });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSettlementById(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const { id } = req.params;

      const settlement = await VendorSettlementModel.findOne({ _id: id, tenantId });
      if (!settlement) {
        return res.status(404).json({ success: false, error: 'Settlement not found' });
      }

      const lockedEntries = await VendorLedgerEntryModel.find({ tenantId, settlementId: id });
      return res.status(200).json({ success: true, data: { settlement, lockedEntries } });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async approveSettlement(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { id } = req.params;

      const settlement = await VendorSettlementService.approveSettlement(tenantId, id, userId);
      return res.status(200).json({ success: true, data: settlement });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async recordPayment(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { settlementId, amountMinor, paymentReference } = req.body;

      if (!settlementId || !amountMinor || !paymentReference) {
        return res.status(400).json({ success: false, error: 'settlementId, amountMinor, and paymentReference are required' });
      }

      const result = await VendorSettlementService.recordPayment(
        tenantId,
        settlementId,
        amountMinor,
        paymentReference,
        userId
      );

      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }

  static async getPayments(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const payments = await VendorPaymentModel.find({ tenantId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: payments });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getReconciliations(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const reconciliations = await SettlementReconciliationModel.find({ tenantId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: reconciliations });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async lockPeriod(req: Request, res: Response) {
    try {
      const tenantId = (req as any).tenantId;
      const userId = (req as any).user?.id || 'system';
      const { periodStart, periodEnd } = req.body;

      if (!periodStart || !periodEnd) {
        return res.status(400).json({ success: false, error: 'periodStart and periodEnd are required' });
      }

      const period = await FinancialPeriodService.lockPeriod(
        tenantId,
        new Date(periodStart),
        new Date(periodEnd),
        userId
      );

      return res.status(200).json({ success: true, data: period });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
  }
}
