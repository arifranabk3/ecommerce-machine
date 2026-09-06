import { CategoryModel, ICategoryDocument } from '../models/Category';
import { ProductModel } from '../models/Product';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';
import { SystemEvents } from '@sellzy/shared';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface ICreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
}

export interface IUpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
}

export class CategoryService {
  static async createCategory(tenantId: string, input: ICreateCategoryInput, actorUserId?: string): Promise<ICategoryDocument> {
    const name = input.name.trim();
    const normalizedName = name.toLowerCase();
    const slug = (input.slug ? slugify(input.slug) : slugify(name)) || `cat-${Date.now()}`;

    // 1. Uniqueness check for tenant
    const existingName = await CategoryModel.findOne({ tenantId, normalizedName, isArchived: false });
    if (existingName) {
      throw new AppError('Category with this name already exists', 400, 'CATEGORY_EXISTS');
    }

    const existingSlug = await CategoryModel.findOne({ tenantId, slug, isArchived: false });
    if (existingSlug) {
      throw new AppError('Category with this slug already exists', 400, 'SLUG_EXISTS');
    }

    // 2. Hierarchy calculations
    let parentId: string | undefined = undefined;
    let path: string[] = [];
    let depth = 0;

    if (input.parentId) {
      const parent = await CategoryModel.findOne({ _id: input.parentId, tenantId, isArchived: false });
      if (!parent) {
        throw new AppError('Parent category not found in this tenant', 404, 'PARENT_NOT_FOUND');
      }
      if (parent.depth >= 5) {
        throw new AppError('Category tree depth limit reached (max 5 levels)', 400, 'MAX_DEPTH_EXCEEDED');
      }
      parentId = parent._id.toString();
      path = [...parent.path, parent._id.toString()];
      depth = parent.depth + 1;
    }

    // 3. Create category
    const category = await CategoryModel.create({
      tenantId,
      name,
      normalizedName,
      slug,
      description: input.description,
      parentId,
      path,
      depth,
      productCount: 0,
      isArchived: false
    });

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.CATEGORY_CREATED,
        resourceType: 'CATEGORY',
        resourceId: category._id.toString(),
        metadata: { name: category.name, slug: category.slug, depth: category.depth }
      });
    }

    return category;
  }

  static async updateCategory(tenantId: string, categoryId: string, input: IUpdateCategoryInput, actorUserId?: string): Promise<ICategoryDocument> {
    const category = await CategoryModel.findOne({ _id: categoryId, tenantId, isArchived: false });
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }

    if (input.name !== undefined) {
      const name = input.name.trim();
      const normalizedName = name.toLowerCase();
      const existingName = await CategoryModel.findOne({ tenantId, normalizedName, _id: { $ne: category._id }, isArchived: false });
      if (existingName) {
        throw new AppError('Category with this name already exists', 400, 'CATEGORY_EXISTS');
      }
      category.name = name;
      category.normalizedName = normalizedName;
      if (!input.slug) {
        category.slug = slugify(name);
      }
    }

    if (input.slug !== undefined) {
      const slug = slugify(input.slug);
      const existingSlug = await CategoryModel.findOne({ tenantId, slug, _id: { $ne: category._id }, isArchived: false });
      if (existingSlug) {
        throw new AppError('Category with this slug already exists', 400, 'SLUG_EXISTS');
      }
      category.slug = slug;
    }

    if (input.description !== undefined) {
      category.description = input.description;
    }

    if (input.parentId !== undefined) {
      if (input.parentId === categoryId) {
        throw new AppError('A category cannot be its own parent', 400, 'CIRCULAR_DEPENDENCY');
      }

      if (!input.parentId) {
        category.parentId = undefined;
        category.path = [];
        category.depth = 0;
      } else {
        const newParent = await CategoryModel.findOne({ _id: input.parentId, tenantId, isArchived: false });
        if (!newParent) {
          throw new AppError('Parent category not found in this tenant', 404, 'PARENT_NOT_FOUND');
        }

        if (newParent.path.includes(categoryId)) {
          throw new AppError('Cannot move category under its own descendant (circular dependency)', 400, 'CIRCULAR_DEPENDENCY');
        }

        if (newParent.depth >= 5) {
          throw new AppError('Category depth limit exceeded', 400, 'MAX_DEPTH_EXCEEDED');
        }

        category.parentId = newParent._id.toString();
        category.path = [...newParent.path, newParent._id.toString()];
        category.depth = newParent.depth + 1;
      }

      await this.updateDescendantPaths(tenantId, category);
    }

    await category.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.CATEGORY_UPDATED,
        resourceType: 'CATEGORY',
        resourceId: category._id.toString(),
        metadata: { name: category.name, parentId: category.parentId }
      });
    }

    return category;
  }

  private static async updateDescendantPaths(tenantId: string, parentCategory: ICategoryDocument): Promise<void> {
    const children = await CategoryModel.find({ tenantId, parentId: parentCategory._id.toString(), isArchived: false });
    for (const child of children) {
      child.path = [...parentCategory.path, parentCategory._id.toString()];
      child.depth = parentCategory.depth + 1;
      await child.save();
      await this.updateDescendantPaths(tenantId, child);
    }
  }

  static async archiveCategory(tenantId: string, categoryId: string, actorUserId?: string): Promise<ICategoryDocument> {
    const category = await CategoryModel.findOne({ _id: categoryId, tenantId, isArchived: false });
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }

    const childCount = await CategoryModel.countDocuments({ tenantId, parentId: categoryId, isArchived: false });
    if (childCount > 0) {
      throw new AppError('Cannot archive category containing child categories. Archive or move children first.', 400, 'HAS_CHILD_CATEGORIES');
    }

    const productCount = await ProductModel.countDocuments({ tenantId, categoryId, isArchived: false });
    if (productCount > 0) {
      throw new AppError('Cannot archive category assigned to active products', 400, 'HAS_ASSIGNED_PRODUCTS');
    }

    category.isArchived = true;
    category.archivedAt = new Date();
    await category.save();

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.CATEGORY_ARCHIVED,
        resourceType: 'CATEGORY',
        resourceId: category._id.toString(),
        metadata: { name: category.name }
      });
    }

    return category;
  }

  static async getCategories(tenantId: string, includeArchived = false): Promise<ICategoryDocument[]> {
    const query: Record<string, unknown> = { tenantId };
    if (!includeArchived) {
      query.isArchived = false;
    }
    return CategoryModel.find(query).sort({ depth: 1, name: 1 });
  }

  static async getCategoryById(tenantId: string, categoryId: string): Promise<ICategoryDocument> {
    const category = await CategoryModel.findOne({ _id: categoryId, tenantId });
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }
    return category;
  }
}
