import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error';

export function validateRequest(schema: ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError('Validation Failed', 400, 'VALIDATION_ERROR', error.errors));
      }
      next(error);
    }
  };
}
