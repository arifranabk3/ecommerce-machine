import mongoose, { Document, Schema } from 'mongoose';
import { ProductType, ProductStatus } from '@sellzy/shared';

export interface ISupplierMapping {
  supplierId: string;
  supplierName?: string;
  supplierSku: string;
  supplierCost: number; // Integer minor units (cents)
  leadTimeDays?: number;
  isPreferred?: boolean;
}

export interface IProductAttribute {
  name: string;
  values: string[];
}

export interface IProductDocument extends Document {
  tenantId: string;
  storeId?: string;
  name: string;
  slug: string;
  sku: string;
  normalizedSKU: string;
  barcode?: string;
  description?: string;
  type: ProductType;
  status: ProductStatus;
  categoryId?: string;
  tags: string[];
  images: string[];
  costPrice: number; // Integer minor units (cents)
  sellingPrice: number; // Integer minor units (cents)
  compareAtPrice?: number; // Integer minor units (cents)
  grossMarginAmount: number; // Integer minor units (cents)
  grossMarginPercentage: number;
  hasVariants: boolean;
  attributes: IProductAttribute[];
  supplierMappings: ISupplierMapping[];
  lowStockThreshold: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProductDocument>({
  tenantId: { type: String, required: true, index: true },
  storeId: { type: String, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String, required: true },
  normalizedSKU: { type: String, required: true },
  barcode: { type: String },
  description: { type: String },
  type: { 
    type: String, 
    enum: Object.values(ProductType), 
    default: ProductType.SIMPLE 
  },
  status: { 
    type: String, 
    enum: Object.values(ProductStatus), 
    default: ProductStatus.DRAFT 
  },
  categoryId: { type: String, index: true },
  tags: [{ type: String }],
  images: [{ type: String }],
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, required: true, default: 0 },
  compareAtPrice: { type: Number },
  grossMarginAmount: { type: Number, default: 0 },
  grossMarginPercentage: { type: Number, default: 0 },
  hasVariants: { type: Boolean, default: false },
  attributes: [{
    name: { type: String, required: true },
    values: [{ type: String }]
  }],
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

productSchema.index({ tenantId: 1, normalizedSKU: 1 }, { unique: true });
productSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
productSchema.index({ tenantId: 1, status: 1, isArchived: 1 });
productSchema.index({ tenantId: 1, categoryId: 1 });

export const ProductModel = mongoose.model<IProductDocument>('Product', productSchema);
