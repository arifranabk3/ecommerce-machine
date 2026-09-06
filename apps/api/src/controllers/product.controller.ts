import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ProductService } from '../services/product.service';
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema
} from '@sellzy/validation';

export class ProductController {
  static async listProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId as string;
      const status = req.query.status as string;
      const includeArchived = req.query.includeArchived === 'true';

      const result = await ProductService.getProducts(tenantId, {
        page,
        limit,
        search,
        categoryId,
        status,
        includeArchived
      });

      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async getProductDetail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const productId = req.params.id;
      const result = await ProductService.getProductById(tenantId, productId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = createProductSchema.parse(req.body);
      const product = await ProductService.createProduct(tenantId, input, actorUserId);
      return res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const productId = req.params.id;
      const actorUserId = req.user!.userId;
      const input = updateProductSchema.parse(req.body);
      const product = await ProductService.updateProduct(tenantId, productId, input, actorUserId);
      return res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  static async archiveProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const productId = req.params.id;
      const actorUserId = req.user!.userId;
      const product = await ProductService.archiveProduct(tenantId, productId, actorUserId);
      return res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  // Variant operations
  static async createVariant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const productId = req.params.id;
      const actorUserId = req.user!.userId;
      const input = createVariantSchema.parse(req.body);
      const variant = await ProductService.createVariant(tenantId, productId, input, actorUserId);
      return res.status(201).json({ success: true, data: variant });
    } catch (err) {
      next(err);
    }
  }

  static async updateVariant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const productId = req.params.id;
      const variantId = req.params.variantId;
      const actorUserId = req.user!.userId;
      const input = updateVariantSchema.parse(req.body);
      const variant = await ProductService.updateVariant(tenantId, productId, variantId, input, actorUserId);
      return res.json({ success: true, data: variant });
    } catch (err) {
      next(err);
    }
  }

  static async archiveVariant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const productId = req.params.id;
      const variantId = req.params.variantId;
      const actorUserId = req.user!.userId;
      const variant = await ProductService.archiveVariant(tenantId, productId, variantId, actorUserId);
      return res.json({ success: true, data: variant });
    } catch (err) {
      next(err);
    }
  }
}
