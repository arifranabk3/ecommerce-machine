import { StoreModel } from '../models/Store';
import { AppError } from '../middleware/error';

export interface ITaxCalculationInput {
  tenantId: string;
  storeId: string;
  subtotalMinor: number;
  shippingMinor?: number;
  discountMinor?: number;
}

export interface ITaxCalculationResult {
  taxMinor: number;
  taxRate: number; // e.g., 0.05 for 5%
  isInclusive: boolean;
  jurisdiction?: string;
}

export class TaxService {
  /**
   * Calculates the final tax amount based on backend-authoritative parameters.
   * Completely ignores any client-supplied tax totals.
   */
  static async calculateTax(input: ITaxCalculationInput): Promise<ITaxCalculationResult> {
    const { tenantId, storeId, subtotalMinor, shippingMinor = 0, discountMinor = 0 } = input;

    // 1. Fetch Store Context (used for jurisdiction/country resolution)
    const store = await StoreModel.findOne({ tenantId, storeId });
    if (!store) {
      throw new AppError('Store not found', 404, 'STORE_NOT_FOUND');
    }

    // 2. Base calculation (subtotal - discount)
    // Note: Depends on local tax laws whether shipping is taxable. 
    // We assume shipping is NOT taxable in this basic abstraction unless configured.
    const taxableAmount = Math.max(0, subtotalMinor - discountMinor);

    // 3. Mock Tax Resolution based on Country for demonstration/foundation.
    // In production, this would call an external tax provider (TaxJar/Stripe Tax) or a dynamic rules engine.
    let taxRate = 0;
    const jurisdiction = store.country;

    if (jurisdiction === 'US') {
      taxRate = 0.07; // 7% Flat Mock US Tax
    } else if (jurisdiction === 'UK' || jurisdiction === 'GB') {
      taxRate = 0.20; // 20% VAT
    } else {
      taxRate = 0.0; // 0% default for other regions (e.g. PK)
    }

    // Tax calculation (Exclusive mode by default)
    const taxMinor = Math.round(taxableAmount * taxRate);

    return {
      taxMinor,
      taxRate,
      isInclusive: false,
      jurisdiction
    };
  }
}
