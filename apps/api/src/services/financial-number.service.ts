import { VendorLedgerCounterModel } from '../models/VendorLedgerCounter';
import { VendorSettlementCounterModel } from '../models/VendorSettlementCounter';
import { SettlementBatchModel } from '../models/SettlementBatch';

export class FinancialNumberService {
  /**
   * Generates a collision-safe, atomic sequential ledger entry number per tenant.
   * Format: LED-000001
   */
  static async generateLedgerEntryNumber(tenantId: string): Promise<string> {
    const counter = await VendorLedgerCounterModel.findOneAndUpdate(
      { tenantId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = String(counter.seq).padStart(6, '0');
    return `LED-${seqStr}`;
  }

  /**
   * Generates a collision-safe, atomic sequential settlement number per tenant and year.
   * Format: SET-YYYY-000001
   */
  static async generateSettlementNumber(tenantId: string): Promise<string> {
    const year = new Date().getUTCFullYear();

    const counter = await VendorSettlementCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = String(counter.seq).padStart(6, '0');
    return `SET-${year}-${seqStr}`;
  }

  /**
   * Generates a collision-safe batch number per tenant and year.
   * Format: BATCH-YYYY-000001
   */
  static async generateBatchNumber(tenantId: string): Promise<string> {
    const year = new Date().getUTCFullYear();
    const count = await SettlementBatchModel.countDocuments({ tenantId });
    const seqStr = String(count + 1).padStart(6, '0');
    return `BATCH-${year}-${seqStr}`;
  }
}
