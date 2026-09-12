import mongoose, { Document, Schema } from 'mongoose';
import { ISupplierMapping } from './Product';

export interface IVariantOption {
  name: string;
  value: string;
}

export interface IProductVariantDocument extends Document {
  tenantId: string;
  storeId: string;
  productId: string;
  name: string;
  sku: string;
  normalizedSKU: string;
  barcode?: string;
  options: IVariantOption[];
  costPrice: number; // Integer minor units (cents)
  sellingPrice: number; // Integer minor units (cents)
  compareAtPrice?: number; // Integer minor units (cents)
  grossMarginAmount: number; // Integer minor units (cents)
  grossMarginPercentage: number;
  image?: string;
  supplierMappings: ISupplierMapping[];
  lowStockThreshold: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariantDocument>({
  tenantId: { type: String, required: true, index: true },
  storeId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  normalizedSKU: { type: String, required: true },
  barcode: { type: String },
  options: [{
    name: { type: String, required: true },
    value: { type: String, required: true }
  }],
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, required: true, default: 0 },
  compareAtPrice: { type: Number },
  grossMarginAmount: { type: Number, default: 0 },
  grossMarginPercentage: { type: Number, default: 0 },
  image: { type: String },
  supplierMappings: [{
    supplierId: { type: String, required: true },
    supplierName: { type: String },
    supplierSku: { type: String, required: true },
    supplierCost: { type: Number, required: true, default: 0 },
    leadTimeDays: { type: Number },
    isPreferred: { type: Boolean, default: false }
  }],
  lowStockThreshold: { type: Number, default: 10 },
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date }
}, {
  timestamps: true
});

productVariantSchema.index({ tenantId: 1, storeId: 1, normalizedSKU: 1 }, { unique: true });
productVariantSchema.index({ tenantId: 1, storeId: 1, productId: 1, isArchived: 1 });

export const ProductVariantModel = mongoose.model<IProductVariantDocument>('ProductVariant', productVariantSchema);
