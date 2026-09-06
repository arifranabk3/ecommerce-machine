import {
  VendorSettlementModel,
  IVendorSettlementDocument
} from '../models/VendorSettlement';
import { VendorLedgerEntryModel } from '../models/VendorLedgerEntry';
import { SettlementBatchModel } from '../models/SettlementBatch';
import { VendorPaymentModel } from '../models/VendorPayment';
import { SettlementReconciliationModel } from '../models/SettlementReconciliation';
import { FinancialNumberService } from './financial-number.service';
import { VendorLedgerService } from './vendor-ledger.service';
import {
  VendorSettlementStatus,
  VendorLedgerDirection,
  VendorLedgerStatus,
  VendorLedgerEntryType,
  SettlementBatchStatus,
  VendorPaymentStatus,
  ReconciliationStatus
} from '@sellzy/shared';

export interface ICalculateSettlementParams {
  tenantId: string;
  vendorId: string;
  periodStart: Date;
  periodEnd: Date;
  currency?: string;
  createdBy?: string;
}

export class VendorSettlementService {
  /**
   * Calculates eligible ledger entries for a vendor in a period and creates a DRAFT settlement snapshot.
   */
  static async calculateSettlement(
    params: ICalculateSettlementParams
  ): Promise<IVendorSettlementDocument> {
    const { tenantId, vendorId, periodStart, periodEnd, currency = 'PKR', createdBy } = params;

    // Find all eligible POSTED entries in period that are NOT already locked in an approved settlement
    const eligibleEntries = await VendorLedgerEntryModel.find({
      tenantId,
      vendorId,
      status: VendorLedgerStatus.POSTED,
      settlementId: { $exists: false },
      createdAt: { $gte: periodStart, $lte: periodEnd }
    });

    let grossPayableMinor = 0;
    let returnAdjustmentsMinor = 0;
    let rtoAdjustmentsMinor = 0;
    let deductionsMinor = 0;
    let manualAdjustmentsMinor = 0;

    for (const entry of eligibleEntries) {
      if (entry.direction === VendorLedgerDirection.CREDIT) {
        if (entry.entryType === VendorLedgerEntryType.ORDER_PAYABLE) {
          grossPayableMinor += entry.amountMinor;
        } else if (entry.entryType === VendorLedgerEntryType.MANUAL_ADJUSTMENT) {
          manualAdjustmentsMinor += entry.amountMinor;
        }
      } else if (entry.direction === VendorLedgerDirection.DEBIT) {
        if (entry.entryType === VendorLedgerEntryType.RETURN_ADJUSTMENT) {
          returnAdjustmentsMinor += entry.amountMinor;
        } else if (entry.entryType === VendorLedgerEntryType.RTO_ADJUSTMENT) {
          rtoAdjustmentsMinor += entry.amountMinor;
        } else if (entry.entryType === VendorLedgerEntryType.DEDUCTION) {
          deductionsMinor += entry.amountMinor;
        } else if (entry.entryType === VendorLedgerEntryType.MANUAL_ADJUSTMENT) {
          manualAdjustmentsMinor -= entry.amountMinor;
        }
      }
    }

    const netPayableCalculated =
      grossPayableMinor -
      returnAdjustmentsMinor -
      rtoAdjustmentsMinor -
      deductionsMinor +
      manualAdjustmentsMinor;

    const netPayableMinor = Math.max(0, netPayableCalculated);
    const settlementNumber = await FinancialNumberService.generateSettlementNumber(tenantId);

    const settlement = new VendorSettlementModel({
      tenantId,
      vendorId,
      settlementNumber,
      status: VendorSettlementStatus.DRAFT,
      periodStart,
      periodEnd,
      currency: currency.toUpperCase(),
      grossPayableMinor,
      returnAdjustmentsMinor,
      rtoAdjustmentsMinor,
      deductionsMinor,
      previousSettlementsMinor: 0,
      manualAdjustmentsMinor,
      netPayableMinor,
      eligibleEntryCount: eligibleEntries.length,
      createdBy
    });

    await settlement.save();
    return settlement;
  }

  /**
   * Approves a settlement, locking underlying eligible entries and transitioning status to APPROVED.
   */
  static async approveSettlement(
    tenantId: string,
    settlementId: string,
    approvedBy: string
  ): Promise<IVendorSettlementDocument> {
    const settlement = await VendorSettlementModel.findOne({ _id: settlementId, tenantId });

    if (!settlement) {
      throw new Error('Settlement not found.');
    }

    if (
      settlement.status !== VendorSettlementStatus.DRAFT &&
      settlement.status !== VendorSettlementStatus.PENDING_REVIEW &&
      settlement.status !== VendorSettlementStatus.PENDING_APPROVAL
    ) {
      throw new Error(`Cannot approve settlement in status ${settlement.status}`);
    }

    // Atomic double-settlement protection: find unlocked eligible entries and tag with settlementId
    const eligibleEntries = await VendorLedgerEntryModel.find({
      tenantId,
      vendorId: settlement.vendorId,
      status: VendorLedgerStatus.POSTED,
      settlementId: { $exists: false },
      createdAt: { $gte: settlement.periodStart, $lte: settlement.periodEnd }
    });

    // Tag entries with settlementId so they cannot be included in any future settlement
    for (const entry of eligibleEntries) {
      entry.settlementId = settlement._id.toString();
      await entry.save();
    }

    settlement.status = VendorSettlementStatus.APPROVED;
    settlement.approvedBy = approvedBy;
    settlement.approvedAt = new Date();
    await settlement.save();

    // Post settlement debit entry to ledger
    if (settlement.netPayableMinor > 0) {
      await VendorLedgerService.postEntry({
        tenantId,
        vendorId: settlement.vendorId,
        entryType: VendorLedgerEntryType.SETTLEMENT,
        direction: VendorLedgerDirection.DEBIT,
        amountMinor: settlement.netPayableMinor,
        currency: settlement.currency,
        sourceType: 'SETTLEMENT',
        sourceId: settlement._id.toString(),
        settlementId: settlement._id.toString(),
        description: `Settlement ${settlement.settlementNumber} payout`,
        reference: settlement.settlementNumber,
        createdBy: approvedBy
      });
    }

    return settlement;
  }

  /**
   * Records payment execution for an APPROVED settlement and verifies reconciliation.
   */
  static async recordPayment(
    tenantId: string,
    settlementId: string,
    amountMinor: number,
    paymentReference: string,
    createdBy?: string
  ): Promise<{ payment: any; reconciliation: any }> {
    const settlement = await VendorSettlementModel.findOne({ _id: settlementId, tenantId });

    if (!settlement) {
      throw new Error('Settlement not found.');
    }

    // Prevent duplicate payments
    const existingPayment = await VendorPaymentModel.findOne({
      tenantId,
      settlementId,
      status: VendorPaymentStatus.PAID
    });

    if (existingPayment) {
      throw new Error('Payment already recorded for this settlement.');
    }

    const payment = new VendorPaymentModel({
      tenantId,
      vendorId: settlement.vendorId,
      settlementId,
      paymentReference,
      amountMinor,
      currency: settlement.currency,
      status: VendorPaymentStatus.PAID,
      paidAt: new Date(),
      createdBy
    });

    await payment.save();

    // Check payment reconciliation match
    const differenceMinor = amountMinor - settlement.netPayableMinor;
    const isMatched = differenceMinor === 0;

    const reconciliation = new SettlementReconciliationModel({
      tenantId,
      settlementId,
      vendorId: settlement.vendorId,
      paymentId: payment._id.toString(),
      expectedAmountMinor: settlement.netPayableMinor,
      actualAmountMinor: amountMinor,
      differenceMinor,
      status: isMatched ? ReconciliationStatus.MATCHED : ReconciliationStatus.MISMATCH,
      notes: isMatched ? 'Payment matches approved net payable' : 'Payment amount discrepancy detected'
    });

    await reconciliation.save();

    if (isMatched) {
      settlement.status = VendorSettlementStatus.PAID;
      settlement.paidAt = new Date();
      settlement.paymentReference = paymentReference;
    } else {
      settlement.status = VendorSettlementStatus.RECONCILIATION_REQUIRED;
    }

    await settlement.save();

    return { payment, reconciliation };
  }

  /**
   * Creates a multi-vendor settlement batch.
   */
  static async createBatch(
    tenantId: string,
    periodStart: Date,
    periodEnd: Date,
    settlementIds: string[],
    createdBy?: string
  ): Promise<any> {
    const batchNumber = await FinancialNumberService.generateBatchNumber(tenantId);
    const settlements = await VendorSettlementModel.find({
      tenantId,
      _id: { $in: settlementIds }
    });

    let totalAmountMinor = 0;
    for (const s of settlements) {
      totalAmountMinor += s.netPayableMinor;
    }

    const batch = new SettlementBatchModel({
      tenantId,
      batchNumber,
      periodStart,
      periodEnd,
      status: SettlementBatchStatus.DRAFT,
      settlementIds,
      totalAmountMinor,
      currency: 'PKR',
      createdBy
    });

    await batch.save();
    return batch;
  }
}
