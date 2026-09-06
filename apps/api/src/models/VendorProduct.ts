import mongoose, { Schema, Document } from 'mongoose';
import { IVendorProduct, VendorProductAvailability } from '@sellzy/shared';

export interface IVendorProductDocument extends Omit<IVendorProduct, 'id'>, Document {}

const VendorProductSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    variantId: { type: String, index: true },
    supplierSKU: { type: String, required: true, trim: true },
    supplierProductName: { type: String, trim: true },
    costPriceMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true, length: 3 },
    minimumOrderQuantity: { type: Number, required: true, default: 1, min: 1 },
    leadTimeDays: { type: Number, required: true, default: 7, min: 0 },
    priority: { type: Number, required: true, default: 1, min: 1 },
    isPrimary: { type: Boolean, required: true, default: false },
    availability: {
      type: String,
      enum: Object.values(VendorProductAvailability),
      default: VendorProductAvailability.IN_STOCK,
      required: true
    }
  },
  {
    timestamps: true
  }
);

VendorProductSchema.index({ tenantId: 1, vendorId: 1, productId: 1, variantId: 1 }, { unique: true });
VendorProductSchema.index({ tenantId: 1, productId: 1, variantId: 1, priority: 1 });
VendorProductSchema.index({ tenantId: 1, supplierSKU: 1 });

export const VendorProductModel = mongoose.model<IVendorProductDocument>('VendorProduct', VendorProductSchema);
