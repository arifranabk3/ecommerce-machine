import { CustomerCounterModel } from '../models/CustomerCounter';

export class CustomerNumberService {
  /**
   * Generates next atomic customer number formatted as CUS-XXXXXX scoped to tenantId.
   */
  static async getNextCustomerNumber(tenantId: string): Promise<string> {
    const counter = await CustomerCounterModel.findOneAndUpdate(
      { tenantId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqString = counter.seq.toString().padStart(6, '0');
    return `CUS-${seqString}`;
  }
}
