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

  // Even if no tenantId is resolved initially, we still run with an empty context.
  // Downstream auth/store middlewares will populate this context object once validated.

  runWithContext(context, () => {
    next();
  });
}
