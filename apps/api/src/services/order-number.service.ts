import { OrderCounterModel } from '../models/OrderCounter';

export class OrderNumberService {
  /**
   * Generates a collision-safe, atomic sequential order number per tenant and year.
   * Format: SZ-YYYY-000001
   */
  static async generateOrderNumber(tenantId: string): Promise<{ orderNumber: string; normalizedOrderNumber: string }> {
    const year = new Date().getUTCFullYear();

    const counter = await OrderCounterModel.findOneAndUpdate(
      { tenantId, year },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = String(counter.seq).padStart(6, '0');
    const orderNumber = `SZ-${year}-${seqStr}`;
    const normalizedOrderNumber = orderNumber.toUpperCase();

    return { orderNumber, normalizedOrderNumber };
  }
}
