import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@sellzy/shared';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  const requestId = (req.headers['x-request-id'] as string) || 'N/A';
  
  if (err instanceof AppError || (err && typeof err === 'object' && typeof err.statusCode === 'number')) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code || 'BAD_REQUEST',
        message: err.message,
        requestId,
        details: err.details
      }
    };
    return res.status(err.statusCode).json(response);
  }

  // Handle Zod Validation Errors
  if (err?.name === 'ZodError') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request body validation failed',
        requestId,
        details: err.errors || err.issues
      }
    };
    return res.status(400).json(response);
  }

  // Handle generic / unexpected error without leaking stack traces or sensitive data
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
      requestId
    }
  };
  return res.status(500).json(response);
}
