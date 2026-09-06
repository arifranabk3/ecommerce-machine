import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { CategoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '@sellzy/validation';

export class CategoryController {
  static async listCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const includeArchived = req.query.includeArchived === 'true';
      const categories = await CategoryService.getCategories(tenantId, includeArchived);
      return res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  static async getCategoryDetail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const categoryId = req.params.id;
      const category = await CategoryService.getCategoryById(tenantId, categoryId);
      return res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  static async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const actorUserId = req.user!.userId;
      const input = createCategorySchema.parse(req.body);
      const category = await CategoryService.createCategory(tenantId, input, actorUserId);
      return res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  static async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const categoryId = req.params.id;
      const actorUserId = req.user!.userId;
      const input = updateCategorySchema.parse(req.body);
      const category = await CategoryService.updateCategory(tenantId, categoryId, input, actorUserId);
      return res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  static async archiveCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.tenantId;
      const categoryId = req.params.id;
      const actorUserId = req.user!.userId;
      const category = await CategoryService.archiveCategory(tenantId, categoryId, actorUserId);
      return res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }
}
