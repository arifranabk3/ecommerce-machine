import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { runWithContext, ExecutionContext } from '../utils/context';

export function contextMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const context: ExecutionContext = {
    tenantId: req.user?.tenantId || (req as any).tenantId,
    storeId: (req as any).storeId,
    userId: req.user?.userId,
    roles: req.user?.roles,
    permissions: (req as any).permissions
  };

  // If no tenantId is resolved by this point, we just run without setting a restricted context,
  // or default to an empty context, which will trigger errors on restricted queries.
  if (!context.tenantId) {
    return next();
  }

  runWithContext(context, () => {
    next();
  });
}
