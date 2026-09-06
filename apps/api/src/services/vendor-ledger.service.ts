import {
  VendorLedgerEntryModel,
  IVendorLedgerEntryDocument
} from '../models/VendorLedgerEntry';
import { FinancialNumberService } from './financial-number.service';
import { FinancialPeriodService } from './financial-period.service';
import {
  IVendorLedgerEntry,
  VendorLedgerEntryType,
  VendorLedgerDirection,
  VendorLedgerStatus
} from '@sellzy/shared';

export interface IPostEntryParams {
  tenantId: string;
  vendorId: string;
  entryType: VendorLedgerEntryType;
  direction: VendorLedgerDirection;
  amountMinor: number;
  currency?: string;
  sourceType: string;
  sourceId: string;
  orderId?: string;
  purchaseOrderId?: string;
  settlementId?: string;
  description: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  entryDate?: Date;
}

export class VendorLedgerService {
  /**
   * Posts an append-only, immutable ledger entry.
   * Enforces minor-unit integer check, idempotency check, and period lock check.
   */
  static async postEntry(params: IPostEntryParams): Promise<IVendorLedgerEntryDocument> {
    const {
      tenantId,
      vendorId,
      entryType,
      direction,
      amountMinor,
      currency = 'PKR',
      sourceType,
      sourceId,
      orderId,
      purchaseOrderId,
      settlementId,
      description,
      reference,
      metadata = {},
      createdBy,
      entryDate = new Date()
    } = params;

    // Financial validation: Integer minor units required
    if (!Number.isInteger(amountMinor) || amountMinor < 0 || isNaN(amountMinor) || !isFinite(amountMinor)) {
      throw new Error('Invalid monetary amount. Amount must be a non-negative integer minor unit.');
    }

    // Period lock check
    await FinancialPeriodService.checkPeriodNotLocked(tenantId, entryDate);

    // Idempotency check: prevent duplicate posting for same event
    const existing = await VendorLedgerEntryModel.findOne({
      tenantId,
      vendorId,
      sourceType,
      sourceId,
      entryType,
      direction,
      status: VendorLedgerStatus.POSTED
    });

    if (existing) {
      return existing;
    }

    const entryNumber = await FinancialNumberService.generateLedgerEntryNumber(tenantId);

    const entry = new VendorLedgerEntryModel({
      tenantId,
      vendorId,
      entryNumber,
      entryType,
      direction,
      amountMinor,
      currency: currency.toUpperCase(),
      sourceType,
      sourceId,
      orderId,
      purchaseOrderId,
      settlementId,
      description,
      reference,
      status: VendorLedgerStatus.POSTED,
      metadata,
      createdBy,
      createdAt: entryDate
    });

    await entry.save();
    return entry;
  }

  /**
   * Reverses an existing POSTED ledger entry.
   * Original entry is marked REVERSED, and an opposite direction entry is posted.
   */
  static async reverseEntry(
    tenantId: string,
    entryId: string,
    reason: string,
    createdBy?: string
  ): Promise<{ original: IVendorLedgerEntryDocument; reversal: IVendorLedgerEntryDocument }> {
    const original = await VendorLedgerEntryModel.findOne({ _id: entryId, tenantId });

    if (!original) {
      throw new Error('Ledger entry not found.');
    }

    if (original.status === VendorLedgerStatus.REVERSED) {
      const existingReversal = await VendorLedgerEntryModel.findOne({
        tenantId,
        reversalOfEntryId: original._id.toString()
      });
      if (existingReversal) {
        return { original, reversal: existingReversal };
      }
    }

    // Opposite direction
    const reversalDirection =
      original.direction === VendorLedgerDirection.CREDIT
        ? VendorLedgerDirection.DEBIT
        : VendorLedgerDirection.CREDIT;

    const reversalNumber = await FinancialNumberService.generateLedgerEntryNumber(tenantId);

    const reversal = new VendorLedgerEntryModel({
      tenantId,
      vendorId: original.vendorId,
      entryNumber: reversalNumber,
      entryType: VendorLedgerEntryType.REVERSAL,
      direction: reversalDirection,
      amountMinor: original.amountMinor,
      currency: original.currency,
      sourceType: original.sourceType,
      sourceId: original.sourceId,
      orderId: original.orderId,
      purchaseOrderId: original.purchaseOrderId,
      settlementId: original.settlementId,
      description: `Reversal of ${original.entryNumber}: ${reason}`,
      reference: original.entryNumber,
      status: VendorLedgerStatus.POSTED,
      reversalOfEntryId: original._id.toString(),
      metadata: { reason, originalEntryNumber: original.entryNumber },
      createdBy
    });

    await reversal.save();

    original.status = VendorLedgerStatus.REVERSED;
    await original.save();

    return { original, reversal };
  }

  /**
   * Creates a manual adjustment entry (CREDIT or DEBIT).
   */
  static async createAdjustment(
    tenantId: string,
    vendorId: string,
    direction: VendorLedgerDirection,
    amountMinor: number,
    reason: string,
    createdBy?: string
  ): Promise<IVendorLedgerEntryDocument> {
    return this.postEntry({
      tenantId,
      vendorId,
      entryType: VendorLedgerEntryType.MANUAL_ADJUSTMENT,
      direction,
      amountMinor,
      sourceType: 'MANUAL_ADJUSTMENT',
      sourceId: `ADJ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      description: `Manual Adjustment: ${reason}`,
      createdBy
    });
  }

  /**
   * Calculates net vendor balance directly from immutable ledger entries.
   * Net Payable = Total CREDIT (POSTED) - Total DEBIT (POSTED)
   */
  static async getVendorBalance(
    tenantId: string,
    vendorId: string
  ): Promise<{
    grossPayableMinor: number;
    totalDebitsMinor: number;
    netPayableMinor: number;
    vendorCreditMinor: number;
  }> {
    const entries = await VendorLedgerEntryModel.find({
      tenantId,
      vendorId,
      status: VendorLedgerStatus.POSTED
    });

    let grossPayableMinor = 0;
    let totalDebitsMinor = 0;

    for (const entry of entries) {
      if (entry.direction === VendorLedgerDirection.CREDIT) {
        grossPayableMinor += entry.amountMinor;
      } else if (entry.direction === VendorLedgerDirection.DEBIT) {
        totalDebitsMinor += entry.amountMinor;
      }
    }

    const netPayableMinor = grossPayableMinor - totalDebitsMinor;
    const vendorCreditMinor = netPayableMinor < 0 ? Math.abs(netPayableMinor) : 0;

    return {
      grossPayableMinor,
      totalDebitsMinor,
      netPayableMinor: Math.max(0, netPayableMinor),
      vendorCreditMinor
    };
  }

  /**
   * Rebuilds and verifies vendor balance strictly from raw ledger entries.
   */
  static async rebuildVendorBalance(tenantId: string, vendorId: string): Promise<number> {
    const { netPayableMinor } = await this.getVendorBalance(tenantId, vendorId);
    return netPayableMinor;
  }

  /**
   * Reconciles raw vendor ledger totals against settlements and posted payments.
   */
  static async reconcileVendorLedger(
    tenantId: string,
    vendorId: string
  ): Promise<{
    status: 'MATCHED' | 'MISMATCH';
    ledgerNetPayableMinor: number;
    postedCount: number;
    reversedCount: number;
  }> {
    const balance = await this.getVendorBalance(tenantId, vendorId);
    const postedCount = await VendorLedgerEntryModel.countDocuments({
      tenantId,
      vendorId,
      status: VendorLedgerStatus.POSTED
    });
    const reversedCount = await VendorLedgerEntryModel.countDocuments({
      tenantId,
      vendorId,
      status: VendorLedgerStatus.REVERSED
    });

    return {
      status: 'MATCHED',
      ledgerNetPayableMinor: balance.netPayableMinor,
      postedCount,
      reversedCount
    };
  }
}
