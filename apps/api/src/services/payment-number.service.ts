import { PaymentCounterModel } from '../models/PaymentCounter';
import { RefundCounterModel } from '../models/RefundCounter';
import { FinancialTransactionCounterModel } from '../models/FinancialTransactionCounter';

export class PaymentNumberService {
  /**
   * Generates a unique, tenant-scoped payment number: PAY-YYYY-XXXXXX
   */
  static async generatePaymentNumber(tenantId: string, date: Date = new Date()): Promise<string> {
    const year = date.getFullYear();
    const counter = await PaymentCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(6, '0');
    return `PAY-${year}-${seqStr}`;
  }

  /**
   * Generates a unique, tenant-scoped refund number: REF-YYYY-XXXXXX
   */
  static async generateRefundNumber(tenantId: string, date: Date = new Date()): Promise<string> {
    const year = date.getFullYear();
    const counter = await RefundCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(6, '0');
    return `REF-${year}-${seqStr}`;
  }

  /**
   * Generates a unique, tenant-scoped financial transaction number: FIN-YYYY-XXXXXX
   */
  static async generateTransactionNumber(tenantId: string, date: Date = new Date()): Promise<string> {
    const year = date.getFullYear();
    const counter = await FinancialTransactionCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(6, '0');
    return `FIN-${year}-${seqStr}`;
  }
}
