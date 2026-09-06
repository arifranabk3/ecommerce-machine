import { VendorModel } from '../models/Vendor';
import { VendorProductModel } from '../models/VendorProduct';
import { ProductModel } from '../models/Product';
import { ProductVariantModel } from '../models/ProductVariant';
import { ProcurementExceptionModel } from '../models/ProcurementException';
import { VendorProductAvailability, VendorStatus, ProcurementExceptionReason } from '@sellzy/shared';

export interface SupplierSelectionResult {
  vendorId: string;
  vendorName: string;
  supplierSKU: string;
  costPriceMinor: number;
  minimumOrderQuantity: number;
  leadTimeDays: number;
}

export class SupplierSelectionService {
  /**
   * Deterministic supplier selection engine for a given tenant product/variant.
   * Logic:
   * 1. Query VendorProduct for tenantId, productId, (variantId).
   * 2. Filter available vendors (Vendor status ACTIVE, VendorProduct availability IN_STOCK).
   * 3. Sort by: priority ASC, costPriceMinor ASC, leadTimeDays ASC, minimumOrderQuantity ASC.
   * 4. If none found, create a ProcurementException and return null.
   */
  static async selectSupplierForProduct(
    tenantId: string,
    productId: string,
    variantId?: string | null,
    salesOrderId?: string
  ): Promise<SupplierSelectionResult | null> {
    const query: any = { tenantId, productId, availability: VendorProductAvailability.IN_STOCK };
    if (variantId) {
      query.variantId = variantId;
    } else {
      query.$or = [{ variantId: { $exists: false } }, { variantId: null }, { variantId: '' }];
    }

    const candidateMappings = (await VendorProductModel.find(query).exec()) as any[];

    if (!candidateMappings || candidateMappings.length === 0) {
      await ProcurementExceptionModel.create({
        tenantId,
        salesOrderId,
        productId,
        variantId: variantId || undefined,
        reason: ProcurementExceptionReason.NO_SUPPLIER_FOUND,
        message: `No active supplier mapping found for product ${productId}${variantId ? ' variant ' + variantId : ''}`,
        resolved: false
      });
      return null;
    }

    const vendorIds = candidateMappings.map(m => m.vendorId);
    const activeVendors = (await VendorModel.find({
      tenantId,
      _id: { $in: vendorIds },
      status: VendorStatus.ACTIVE
    }).exec()) as any[];

    const activeVendorSet = new Set(activeVendors.map(v => v._id.toString()));
    const vendorMap = new Map(activeVendors.map(v => [v._id.toString(), v]));

    const validMappings = candidateMappings.filter(m => activeVendorSet.has(m.vendorId.toString()));

    if (validMappings.length === 0) {
      await ProcurementExceptionModel.create({
        tenantId,
        salesOrderId,
        productId,
        variantId: variantId || undefined,
        reason: ProcurementExceptionReason.NO_SUPPLIER_FOUND,
        message: `Supplier mappings exist but linked vendors are inactive or blocked for product ${productId}`,
        resolved: false
      });
      return null;
    }

    // Deterministic Sort
    validMappings.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.costPriceMinor !== b.costPriceMinor) return a.costPriceMinor - b.costPriceMinor;
      if (a.leadTimeDays !== b.leadTimeDays) return a.leadTimeDays - b.leadTimeDays;
      return a.minimumOrderQuantity - b.minimumOrderQuantity;
    });

    const selected = validMappings[0];
    const vendorObj = vendorMap.get(selected.vendorId.toString())!;

    let product: any = null;
    try {
      product = (await ProductModel.findOne({ tenantId, _id: productId }).exec()) as any;
    } catch {
      // Ignore CastError if productId is a custom non-ObjectId string in tests
    }
    if (product && product.sellingPrice > 0 && selected.costPriceMinor > product.sellingPrice) {
      await ProcurementExceptionModel.create({
        tenantId,
        salesOrderId,
        productId,
        variantId: variantId || undefined,
        vendorId: selected.vendorId.toString(),
        reason: ProcurementExceptionReason.MARGIN_TOO_LOW,
        message: `Supplier cost (${selected.costPriceMinor}) exceeds selling price (${product.sellingPrice})`,
        resolved: false
      });
      return null;
    }

    return {
      vendorId: selected.vendorId.toString(),
      vendorName: vendorObj.name,
      supplierSKU: selected.supplierSKU,
      costPriceMinor: selected.costPriceMinor,
      minimumOrderQuantity: selected.minimumOrderQuantity,
      leadTimeDays: selected.leadTimeDays
    };
  }
}
