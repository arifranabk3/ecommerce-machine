import { ProductModel, IProductDocument, ISupplierMapping, IProductAttribute } from '../models/Product';
import { ProductVariantModel, IProductVariantDocument, IVariantOption } from '../models/ProductVariant';
import { CategoryModel } from '../models/Category';
import { EntitlementService } from './entitlement.service';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';
import { SystemEvents, ProductType, ProductStatus } from '@sellzy/shared';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface ICreateProductInput {
  name: string;
  slug?: string;
  sku: string;
  barcode?: string;
  description?: string;
  type?: ProductType | 'SIMPLE' | 'VARIABLE' | 'BUNDLE' | 'SERVICE';
  productType?: ProductType | 'SIMPLE' | 'VARIABLE' | 'BUNDLE' | 'SERVICE';
  status?: ProductStatus | 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  categoryId?: string | null;
  tags?: string[];
  images?: string[];
  costPrice?: number;
  sellingPrice: number;
  compareAtPrice?: number;
  attributes?: IProductAttribute[] | Record<string, any>;
  supplierMappings?: ISupplierMapping[];
  lowStockThreshold?: number;
}

export interface IUpdateProductInput {
  name?: string;
  slug?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  type?: ProductType | 'SIMPLE' | 'VARIABLE' | 'BUNDLE' | 'SERVICE';
  productType?: ProductType | 'SIMPLE' | 'VARIABLE' | 'BUNDLE' | 'SERVICE';
  status?: ProductStatus | 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  categoryId?: string | null;
  tags?: string[];
  images?: string[];
  costPrice?: number;
  sellingPrice?: number;
  compareAtPrice?: number;
  attributes?: IProductAttribute[] | Record<string, any>;
  supplierMappings?: ISupplierMapping[];
  lowStockThreshold?: number;
}

export interface ICreateVariantInput {
  name: string;
  sku: string;
  barcode?: string;
  options?: IVariantOption[];
  attributes?: Record<string, string>;
  costPrice?: number;
  sellingPrice?: number;
  compareAtPrice?: number;
  image?: string;
  supplierMappings?: ISupplierMapping[];
  lowStockThreshold?: number;
}

export interface IUpdateVariantInput {
  name?: string;
  sku?: string;
  barcode?: string;
  options?: IVariantOption[];
  attributes?: Record<string, string>;
  costPrice?: number;
  sellingPrice?: number;
  compareAtPrice?: number;
  image?: string;
  supplierMappings?: ISupplierMapping[];
  lowStockThreshold?: number;
}

export class ProductService {
  static calculateMargin(costPrice = 0, sellingPrice = 0): { grossMarginAmount: number; grossMarginPercentage: number } {
    const grossMarginAmount = Math.max(0, sellingPrice - costPrice);
    const grossMarginPercentage = sellingPrice > 0 ? Number(((grossMarginAmount / sellingPrice) * 100).toFixed(2)) : 0;
    return { grossMarginAmount, grossMarginPercentage };
  }

  private static formatAttributes(attrs?: IProductAttribute[] | Record<string, any>): IProductAttribute[] {
    if (!attrs) return [];
    if (Array.isArray(attrs)) return attrs;
    return Object.entries(attrs).map(([name, val]) => ({
      name,
      values: Array.isArray(val) ? val.map(String) : [String(val)]
    }));
  }

  private static formatVariantOptions(options?: IVariantOption[], attributes?: Record<string, string>): IVariantOption[] {
    if (options && options.length > 0) return options;
    if (attributes) {
      return Object.entries(attributes).map(([name, value]) => ({ name, value: String(value) }));
    }
    return [];
  }

  static async createProduct(tenantId: string, input: ICreateProductInput, actorUserId?: string): Promise<IProductDocument> {
    const sku = input.sku.trim().toUpperCase();
    const normalizedSKU = sku;
    const name = input.name.trim();
    const slug = (input.slug ? slugify(input.slug) : slugify(name)) || `prod-${Date.now()}`;

    const canAdd = await EntitlementService.checkTenantLimit(tenantId, 'maxProducts', 1);
    if (!canAdd) {
      throw new AppError('Plan product limit reached. Upgrade your plan to add more products.', 403, 'LIMIT_EXCEEDED');
    }

    const existingProductSku = await ProductModel.findOne({ tenantId, normalizedSKU, isArchived: false });
    if (existingProductSku) {
      throw new AppError('Product with this SKU already exists', 400, 'SKU_EXISTS');
    }

    const existingVariantSku = await ProductVariantModel.findOne({ tenantId, normalizedSKU, isArchived: false });
    if (existingVariantSku) {
      throw new AppError('Variant with this SKU already exists', 400, 'SKU_EXISTS');
    }

    const existingSlug = await ProductModel.findOne({ tenantId, slug, isArchived: false });
    if (existingSlug) {
      throw new AppError('Product with this slug already exists', 400, 'SLUG_EXISTS');
    }

    const categoryId = input.categoryId || undefined;
    if (categoryId) {
      const cat = await CategoryModel.findOne({ _id: categoryId, tenantId, isArchived: false });
      if (!cat) {
        throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
      }
    }

    const costPrice = Math.max(0, Math.round(input.costPrice || 0));
    const sellingPrice = Math.max(0, Math.round(input.sellingPrice));
    const compareAtPrice = input.compareAtPrice !== undefined ? Math.max(0, Math.round(input.compareAtPrice)) : undefined;
    const { grossMarginAmount, grossMarginPercentage } = this.calculateMargin(costPrice, sellingPrice);

    const productType = (input.productType || input.type || ProductType.SIMPLE) as ProductType;
    const status = (input.status || ProductStatus.DRAFT) as ProductStatus;

    const product = await ProductModel.create({
      tenantId,
      name,
      slug,
      sku,
      normalizedSKU,
      barcode: input.barcode?.trim(),
      description: input.description,
      type: productType,
      status,
      categoryId,
      tags: input.tags || [],
      images: input.images || [],
      costPrice,
      sellingPrice,
      compareAtPrice,
      grossMarginAmount,
      grossMarginPercentage,
      hasVariants: false,
      attributes: this.formatAttributes(input.attributes),
      supplierMappings: input.supplierMappings || [],
      lowStockThreshold: input.lowStockThreshold ?? 10,
      isArchived: false
    });

    if (categoryId) {
      await CategoryModel.updateOne({ _id: categoryId }, { $inc: { productCount: 1 } });
    }

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.PRODUCT_CREATED,
        resourceType: 'PRODUCT',
        resourceId: product._id.toString(),
        metadata: { sku: product.sku, name: product.name }
      });
    }

    return product;
  }

  static async updateProduct(tenantId: string, productId: string, input: IUpdateProductInput, actorUserId?: string): Promise<IProductDocument> {
    const product = await ProductModel.findOne({ _id: productId, tenantId, isArchived: false });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    if (input.sku !== undefined) {
      const sku = input.sku.trim().toUpperCase();
      const existingSku = await ProductModel.findOne({ tenantId, normalizedSKU: sku, _id: { $ne: product._id }, isArchived: false });
      if (existingSku) {
        throw new AppError('Product with this SKU already exists', 400, 'SKU_EXISTS');
      }
      const existingVarSku = await ProductVariantModel.findOne({ tenantId, normalizedSKU: sku, isArchived: false });
      if (existingVarSku) {
        throw new AppError('Variant with this SKU already exists', 400, 'SKU_EXISTS');
      }
      product.sku = sku;
      product.normalizedSKU = sku;
    }

    if (input.name !== undefined) {
      product.name = input.name.trim();
      if (!input.slug) {
        product.slug = slugify(product.name);
      }
    }

    if (input.slug !== undefined) {
      const slug = slugify(input.slug);
      const existingSlug = await ProductModel.findOne({ tenantId, slug, _id: { $ne: product._id }, isArchived: false });
      if (existingSlug) {
        throw new AppError('Product with this slug already exists', 400, 'SLUG_EXISTS');
      }
      product.slug = slug;
    }

    const newCategoryId = input.categoryId === null ? undefined : input.categoryId;
    if (newCategoryId !== undefined && newCategoryId !== product.categoryId) {
      if (newCategoryId) {
        const cat = await CategoryModel.findOne({ _id: newCategoryId, tenantId, isArchived: false });
        if (!cat) {
          throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
        }
      }
      if (product.categoryId) {
        await CategoryModel.updateOne({ _id: product.categoryId }, { $inc: { productCount: -1 } });
      }
      if (newCategoryId) {
        await CategoryModel.updateOne({ _id: newCategoryId }, { $inc: { productCount: 1 } });
      }
      product.categoryId = newCategoryId;
    }

    if (input.costPrice !== undefined || input.sellingPrice !== undefined) {
      const costPrice = input.costPrice !== undefined ? Math.max(0, Math.round(input.costPrice)) : product.costPrice;
      const sellingPrice = input.sellingPrice !== undefined ? Math.max(0, Math.round(input.sellingPrice)) : product.sellingPrice;
      const margin = this.calculateMargin(costPrice, sellingPrice);

      product.costPrice = costPrice;
      product.sellingPrice = sellingPrice;
      product.grossMarginAmount = margin.grossMarginAmount;
      product.grossMarginPercentage = margin.grossMarginPercentage;
    }

    if (input.compareAtPrice !== undefined) {
      product.compareAtPrice = Math.max(0, Math.round(input.compareAtPrice));
    }

    const updatedType = input.productType || input.type;
    if (updatedType !== undefined) product.type = updatedType as ProductType;
    if (input.status !== undefined) product.status = input.status as ProductStatus;
    if (input.barcode !== undefined) product.barcode = input.barcode.trim();
    if (input.description !== undefined) product.description = input.description;
    if (input.tags !== undefined) product.tags = input.tags;
    if (input.images !== undefined) product.images = input.images;
    if (input.attributes !== undefined) product.attributes = this.formatAttributes(input.attributes);
    if (input.supplierMappings !== undefined) product.supplierMappings = input.supplierMappings;
    if (input.lowStockThreshold !== undefined) product.lowStockThreshold = input.lowStockThreshold;

    await product.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.PRODUCT_UPDATED,
        resourceType: 'PRODUCT',
        resourceId: product._id.toString(),
        metadata: { sku: product.sku, name: product.name }
      });
    }

    return product;
  }

  static async archiveProduct(tenantId: string, productId: string, actorUserId?: string): Promise<IProductDocument> {
    const product = await ProductModel.findOne({ _id: productId, tenantId, isArchived: false });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    const now = new Date();
    product.isArchived = true;
    product.archivedAt = now;
    product.status = ProductStatus.ARCHIVED;
    await product.save();

    await ProductVariantModel.updateMany({ tenantId, productId }, { $set: { isArchived: true, archivedAt: now } });

    if (product.categoryId) {
      await CategoryModel.updateOne({ _id: product.categoryId }, { $inc: { productCount: -1 } });
    }

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.PRODUCT_ARCHIVED,
        resourceType: 'PRODUCT',
        resourceId: product._id.toString(),
        metadata: { sku: product.sku }
      });
    }

    return product;
  }

  static async createVariant(tenantId: string, productId: string, input: ICreateVariantInput, actorUserId?: string): Promise<IProductVariantDocument> {
    const product = await ProductModel.findOne({ _id: productId, tenantId, isArchived: false });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    const sku = input.sku.trim().toUpperCase();
    const normalizedSKU = sku;

    const existingProductSku = await ProductModel.findOne({ tenantId, normalizedSKU, isArchived: false });
    if (existingProductSku) {
      throw new AppError('SKU already exists on another product', 400, 'SKU_EXISTS');
    }

    const existingVariantSku = await ProductVariantModel.findOne({ tenantId, normalizedSKU, isArchived: false });
    if (existingVariantSku) {
      throw new AppError('Variant with this SKU already exists', 400, 'SKU_EXISTS');
    }

    const costPrice = Math.max(0, Math.round(input.costPrice ?? product.costPrice));
    const sellingPrice = Math.max(0, Math.round(input.sellingPrice ?? product.sellingPrice));
    const compareAtPrice = input.compareAtPrice !== undefined ? Math.max(0, Math.round(input.compareAtPrice)) : product.compareAtPrice;
    const margin = this.calculateMargin(costPrice, sellingPrice);

    const variant = await ProductVariantModel.create({
      tenantId,
      productId,
      name: input.name.trim(),
      sku,
      normalizedSKU,
      barcode: input.barcode?.trim(),
      options: this.formatVariantOptions(input.options, input.attributes),
      costPrice,
      sellingPrice,
      compareAtPrice,
      grossMarginAmount: margin.grossMarginAmount,
      grossMarginPercentage: margin.grossMarginPercentage,
      image: input.image,
      supplierMappings: input.supplierMappings || [],
      lowStockThreshold: input.lowStockThreshold ?? product.lowStockThreshold,
      isArchived: false
    });

    if (!product.hasVariants || product.type !== ProductType.VARIABLE) {
      product.hasVariants = true;
      product.type = ProductType.VARIABLE;
      await product.save();
    }

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.VARIANT_CREATED,
        resourceType: 'PRODUCT_VARIANT',
        resourceId: variant._id.toString(),
        metadata: { productId, sku: variant.sku, name: variant.name }
      });
    }

    return variant;
  }

  static async updateVariant(tenantId: string, productId: string, variantId: string, input: IUpdateVariantInput, actorUserId?: string): Promise<IProductVariantDocument> {
    const variant = await ProductVariantModel.findOne({ _id: variantId, productId, tenantId, isArchived: false });
    if (!variant) {
      throw new AppError('Product variant not found', 404, 'VARIANT_NOT_FOUND');
    }

    if (input.sku !== undefined) {
      const sku = input.sku.trim().toUpperCase();
      const existingProductSku = await ProductModel.findOne({ tenantId, normalizedSKU: sku, isArchived: false });
      if (existingProductSku) {
        throw new AppError('SKU already exists on a product', 400, 'SKU_EXISTS');
      }
      const existingVariantSku = await ProductVariantModel.findOne({ tenantId, normalizedSKU: sku, _id: { $ne: variant._id }, isArchived: false });
      if (existingVariantSku) {
        throw new AppError('Variant with this SKU already exists', 400, 'SKU_EXISTS');
      }
      variant.sku = sku;
      variant.normalizedSKU = sku;
    }

    if (input.name !== undefined) variant.name = input.name.trim();
    if (input.barcode !== undefined) variant.barcode = input.barcode.trim();
    if (input.options !== undefined || input.attributes !== undefined) {
      variant.options = this.formatVariantOptions(input.options, input.attributes);
    }
    if (input.image !== undefined) variant.image = input.image;
    if (input.supplierMappings !== undefined) variant.supplierMappings = input.supplierMappings;
    if (input.lowStockThreshold !== undefined) variant.lowStockThreshold = input.lowStockThreshold;

    if (input.costPrice !== undefined || input.sellingPrice !== undefined) {
      const costPrice = input.costPrice !== undefined ? Math.max(0, Math.round(input.costPrice)) : variant.costPrice;
      const sellingPrice = input.sellingPrice !== undefined ? Math.max(0, Math.round(input.sellingPrice)) : variant.sellingPrice;
      const margin = this.calculateMargin(costPrice, sellingPrice);

      variant.costPrice = costPrice;
      variant.sellingPrice = sellingPrice;
      variant.grossMarginAmount = margin.grossMarginAmount;
      variant.grossMarginPercentage = margin.grossMarginPercentage;
    }

    if (input.compareAtPrice !== undefined) {
      variant.compareAtPrice = Math.max(0, Math.round(input.compareAtPrice));
    }

    await variant.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.VARIANT_UPDATED,
        resourceType: 'PRODUCT_VARIANT',
        resourceId: variant._id.toString(),
        metadata: { sku: variant.sku }
      });
    }

    return variant;
  }

  static async archiveVariant(tenantId: string, productId: string, variantId: string, actorUserId?: string): Promise<IProductVariantDocument> {
    const variant = await ProductVariantModel.findOne({ _id: variantId, productId, tenantId, isArchived: false });
    if (!variant) {
      throw new AppError('Product variant not found', 404, 'VARIANT_NOT_FOUND');
    }

    variant.isArchived = true;
    variant.archivedAt = new Date();
    await variant.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.VARIANT_ARCHIVED,
        resourceType: 'PRODUCT_VARIANT',
        resourceId: variant._id.toString(),
        metadata: { sku: variant.sku }
      });
    }

    return variant;
  }

  static async getProducts(tenantId: string, options: { page?: number; limit?: number; search?: string; categoryId?: string; status?: string; includeArchived?: boolean }) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { tenantId };
    if (!options.includeArchived) {
      query.isArchived = false;
    }
    if (options.categoryId) {
      query.categoryId = options.categoryId;
    }
    if (options.status) {
      query.status = options.status;
    }
    if (options.search) {
      const searchRegex = new RegExp(options.search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { sku: searchRegex }, { barcode: searchRegex }];
    }

    const [items, total] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getProductById(tenantId: string, productId: string) {
    const product = await ProductModel.findOne({ _id: productId, tenantId });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    const variants = await ProductVariantModel.find({ tenantId, productId, isArchived: false });
    return { product, variants };
  }
}
