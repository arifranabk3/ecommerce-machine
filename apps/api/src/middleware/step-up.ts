import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from './auth';
import { UserModel } from '../models/User';
import { AppError } from './error';
import { SecurityService } from '../services/security.service';

export async function stepUpRequired(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const stepUpPassword = req.headers['x-step-up-password'] as string;
  
  if (!stepUpPassword) {
    return next(new AppError('Step-up password confirmation required for sensitive operation', 403, 'STEP_UP_REQUIRED'));
  }

  if (!req.user) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
  }

  const user = await UserModel.findOne({ _id: req.user.userId, tenantId: req.user.tenantId }).select('+passwordHash');
  if (!user) {
    return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
  }

  const isMatch = await bcrypt.compare(stepUpPassword, user.passwordHash);
  if (!isMatch) {
    await SecurityService.logSecurityEvent({
      tenantId: req.user.tenantId,
      actorUserId: req.user.userId,
      action: 'STEP_UP_FAILED',
      result: 'FAILURE'
    });
    return next(new AppError('Step-up authentication failed: incorrect password', 403, 'STEP_UP_FAILED'));
  }

  await SecurityService.logSecurityEvent({
    tenantId: req.user.tenantId,
    actorUserId: req.user.userId,
    action: 'STEP_UP_COMPLETED'
  });

  next();
}
