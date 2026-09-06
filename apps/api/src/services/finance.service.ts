import {
  FinancialTransactionModel,
  IFinancialTransactionDocument
} from '../models/FinancialTransaction';
import { PaymentNumberService } from './payment-number.service';
import {
  FinancialTransactionType,
  FinancialTransactionDirection
} from '@sellzy/shared';

export interface IPostFinancialTransactionParams {
  tenantId: string;
  type: FinancialTransactionType;
  direction: FinancialTransactionDirection;
  amountMinor: number;
  currency?: string;
  sourceType: string;
  sourceId: string;
}

export class FinanceService {
  /**
   * Posts an immutable financial ledger transaction.
   */
  static async postTransaction(
    params: IPostFinancialTransactionParams
  ): Promise<IFinancialTransactionDocument> {
    const {
      tenantId,
      type,
      direction,
      amountMinor,
      currency = 'PKR',
      sourceType,
      sourceId
    } = params;

    if (!Number.isInteger(amountMinor) || amountMinor < 0 || isNaN(amountMinor) || !isFinite(amountMinor)) {
      throw new Error('Invalid financial transaction amount. Amount must be a non-negative integer minor unit.');
    }

    const transactionNumber = await PaymentNumberService.generateTransactionNumber(tenantId);

    const transaction = new FinancialTransactionModel({
      tenantId,
      transactionNumber,
      type,
      direction,
      amountMinor,
      currency: currency.toUpperCase(),
      sourceType,
      sourceId,
      status: 'POSTED'
    });

    await transaction.save();
    return transaction;
  }

  /**
   * Calculates high-level financial summary metrics for the Finance Dashboard.
   */
  static async getSummary(tenantId: string) {
    const transactions = await FinancialTransactionModel.find({ tenantId, status: 'POSTED' });

    let grossRevenueMinor = 0;
    let refundsMinor = 0;
    let paymentFeesMinor = 0;
    let codPendingMinor = 0;
    let netCollectionsMinor = 0;

    for (const tx of transactions) {
      if (tx.type === FinancialTransactionType.PAYMENT && tx.direction === FinancialTransactionDirection.CREDIT) {
        grossRevenueMinor += tx.amountMinor;
      } else if (tx.type === FinancialTransactionType.REFUND && tx.direction === FinancialTransactionDirection.DEBIT) {
        refundsMinor += tx.amountMinor;
      } else if (tx.type === FinancialTransactionType.PAYMENT_FEE && tx.direction === FinancialTransactionDirection.DEBIT) {
        paymentFeesMinor += tx.amountMinor;
      }
    }

    netCollectionsMinor = grossRevenueMinor - refundsMinor - paymentFeesMinor;

    return {
      tenantId,
      grossRevenueMinor,
      refundsMinor,
      paymentFeesMinor,
      netCollectionsMinor,
      currency: 'PKR',
      totalTransactions: transactions.length
    };
  }
}
