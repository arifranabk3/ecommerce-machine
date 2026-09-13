import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AppError } from './error';
import { StoreModel } from '../models/Store';
import { UserModel } from '../models/User';

export async function storeScope(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (!req.user || !req.user.tenantId) {
    return next(new AppError('Tenant scope required', 400, 'TENANT_SCOPE_REQUIRED'));
  }

  // Expect storeId to be passed in header X-Store-ID or body/query depending on standard.
  // We'll prioritize X-Store-ID header as standard for multi-store context in SaaS API
  const requestStoreId = (req.headers['x-store-id'] as string) || req.body?.storeId || req.query?.storeId;

  if (!requestStoreId) {
    return next(new AppError('Store context (X-Store-ID) required', 400, 'STORE_SCOPE_REQUIRED'));
  }

  try {
    // 1. Verify user can access store
    const user = await UserModel.findOne({ _id: req.user.userId, tenantId: req.user.tenantId });
    if (!user) {
      return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
    }

    if (!user.isOwner) {
      const hasAccess = user.allowedStoreIds?.includes('*') || user.allowedStoreIds?.includes(requestStoreId);
      if (!hasAccess) {
        return next(new AppError('Forbidden: User does not have access to this store', 403, 'STORE_ACCESS_DENIED'));
      }
    }

    // 2. Verify store belongs to tenant
    const store = await StoreModel.findOne({ storeId: requestStoreId, tenantId: req.user.tenantId });
    if (!store) {
      return next(new AppError('Forbidden: Store does not exist or does not belong to this tenant', 403, 'STORE_MISMATCH'));
    }

    // 3. Attach validated storeId to request
    (req as any).storeId = requestStoreId;
    
    // Attach helper to scope queries automatically
    req.body = req.body || {};
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      req.body.storeId = requestStoreId;
    }
    
    next();
  } catch (err) {
    return next(new AppError('Failed to verify store context', 500, 'INTERNAL_SERVER_ERROR'));
  }
}
