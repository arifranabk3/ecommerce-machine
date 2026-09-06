import { VendorCounterModel } from '../models/VendorCounter';
import { PurchaseOrderCounterModel } from '../models/PurchaseOrderCounter';

export class VendorNumberService {
  /**
   * Generates a collision-safe, atomic sequential vendor number per tenant.
   * Format: VEN-100001
   */
  static async generateVendorNumber(tenantId: string): Promise<{ vendorNumber: string; normalizedVendorNumber: string }> {
    const counter = await VendorCounterModel.findOneAndUpdate(
      { tenantId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = String(counter.seq).padStart(6, '0');
    const vendorNumber = `VEN-${seqStr}`;
    const normalizedVendorNumber = vendorNumber.toUpperCase();

    return { vendorNumber, normalizedVendorNumber };
  }

  /**
   * Generates a collision-safe, atomic sequential purchase order number per tenant and year.
   * Format: PO-YYYY-000001
   */
  static async generatePoNumber(tenantId: string): Promise<{ poNumber: string; normalizedPoNumber: string }> {
    const year = new Date().getUTCFullYear();

    const counter = await PurchaseOrderCounterModel.findOneAndUpdate(
      { tenantId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = String(counter.seq).padStart(6, '0');
    const poNumber = `PO-${year}-${seqStr}`;
    const normalizedPoNumber = poNumber.toUpperCase();

    return { poNumber, normalizedPoNumber };
  }
}
