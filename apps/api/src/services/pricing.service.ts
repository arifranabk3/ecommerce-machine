import { ProductModel } from '../models/Product';
import { ProductVariantModel } from '../models/ProductVariant';
import { StoreModel } from '../models/Store';
import { AppError } from '../middleware/error';

export interface IPricingResolutionResult {
  unitPriceMinor: number;
  compareAtPriceMinor?: number;
  currency: string;
  source: 'PRODUCT' | 'VARIANT';
}

export class PricingService {
  /**
   * Resolves the authoritative backend price for a given product or variant.
   * Completely ignores any client-supplied pricing.
   */
  static async resolvePrice(
    tenantId: string,
    storeId: string,
    productId: string,
    variantId?: string
  ): Promise<IPricingResolutionResult> {
    // 1. Fetch Store to determine the authoritative currency
    const store = await StoreModel.findOne({ tenantId, storeId });
    if (!store) {
      throw new AppError('Store not found', 404, 'STORE_NOT_FOUND');
    }

    const currency = store.currency.toUpperCase();

    // 2. Fetch Base Product
    const product = await ProductModel.findOne({ tenantId, storeId, _id: productId });
    if (!product || product.isArchived) {
      throw new AppError('Product not found or is archived', 404, 'PRODUCT_NOT_FOUND');
    }

    // 3. Resolve Variant Pricing (if applicable)
    if (variantId) {
      const variant = await ProductVariantModel.findOne({
        tenantId,
        storeId,
        productId,
        _id: variantId
      });

      if (!variant || variant.isArchived) {
        throw new AppError('Variant not found or is archived', 404, 'VARIANT_NOT_FOUND');
      }

      return {
        unitPriceMinor: variant.sellingPrice,
        compareAtPriceMinor: variant.compareAtPrice,
        currency,
        source: 'VARIANT'
      };
    }

    // 4. Resolve Base Product Pricing
    return {
      unitPriceMinor: product.sellingPrice,
      compareAtPriceMinor: product.compareAtPrice,
      currency,
      source: 'PRODUCT'
    };
  }
}
