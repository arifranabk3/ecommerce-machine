import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AppError } from './error';

export function tenantScope(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (!req.user || !req.user.tenantId) {
    return next(new AppError('Tenant scope required', 400, 'TENANT_SCOPE_REQUIRED'));
  }

  (req as any).tenantId = req.user.tenantId;
  
  // Attach helper to scope queries automatically
  req.body = req.body || {};
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body.tenantId = req.user.tenantId;
  }
  next();
}
