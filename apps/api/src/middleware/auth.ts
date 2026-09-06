import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@sellzy/config';
import { AppError } from './error';
import { SessionModel } from '../models/Session';
import { UserModel } from '../models/User';
import { RbacService } from '../services/rbac.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
    roles: string[];
    sessionId: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new AppError('Authentication token required', 401, 'UNAUTHORIZED'));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET as jwt.Secret) as { 
      userId: string; 
      tenantId: string; 
      roles: string[]; 
      sessionId: string;
    };

    // Validate active session in database (revocation & expiration check)
    const session = await SessionModel.findOne({ 
      sessionId: payload.sessionId, 
      token, 
      revokedAt: { $exists: false } 
    });

    if (!session || session.expiresAt < new Date()) {
      return next(new AppError('Session expired or revoked', 401, 'INVALID_SESSION'));
    }

    // Check account status in DB
    const user = await UserModel.findOne({ _id: payload.userId, tenantId: payload.tenantId });
    if (!user || user.status === 'SUSPENDED' || user.status === 'DISABLED' || user.status === 'LOCKED') {
      return next(new AppError('Account is inactive, suspended, or locked', 403, 'ACCOUNT_DISABLED'));
    }

    // Update lastActivityAt on session
    session.lastActivityAt = new Date();
    await session.save();

    req.user = payload;
    (req as any).tenantId = payload.tenantId;
    (req as any).permissions = await RbacService.getEffectivePermissions(payload.userId, payload.tenantId);
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token', 401, 'UNAUTHORIZED'));
  }
}

export function authorizePermissions(requiredPermissions: string[]) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    // Strict Tenant isolation check
    const requestTenantId = req.headers['x-tenant-id'] as string;
    if (requestTenantId && requestTenantId !== req.user.tenantId) {
      return next(new AppError('Forbidden: Tenant isolation mismatch', 403, 'TENANT_MISMATCH'));
    }

    const effectivePermissions = await RbacService.getEffectivePermissions(req.user.userId, req.user.tenantId);

    if (effectivePermissions.includes('*')) {
      return next();
    }

    const hasAll = requiredPermissions.every(p => effectivePermissions.includes(p));
    if (hasAll) {
      return next();
    }

    return next(new AppError('Forbidden: Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'));
  };
}

export function requirePermission(permissionKey: string) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const requestTenantId = req.headers['x-tenant-id'] as string;
    if (requestTenantId && requestTenantId !== req.user.tenantId) {
      return next(new AppError('Forbidden: Tenant isolation mismatch', 403, 'TENANT_MISMATCH'));
    }

    const effectivePermissions = await RbacService.getEffectivePermissions(req.user.userId, req.user.tenantId);

    if (effectivePermissions.includes('*') || effectivePermissions.includes(permissionKey)) {
      return next();
    }

    return next(new AppError(`Forbidden: Missing required permission '${permissionKey}'`, 403, 'INSUFFICIENT_PERMISSIONS'));
  };
}

