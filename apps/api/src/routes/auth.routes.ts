import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rate-limiter';
import { 
  registerTenantSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  changePasswordSchema,
  mfaVerifySchema
} from '@sellzy/validation';

export const authRouter = Router();

// Public Authentication Endpoints (Rate Limited)
authRouter.post('/register', authRateLimiter, validateRequest(registerTenantSchema), AuthController.registerTenant);
authRouter.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
authRouter.post('/forgot-password', authRateLimiter, validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
authRouter.post('/reset-password', authRateLimiter, validateRequest(resetPasswordSchema), AuthController.resetPassword);

// Protected Authentication Endpoints
authRouter.post('/logout', authenticateToken, AuthController.logout);
authRouter.post('/logout-all', authenticateToken, AuthController.logoutAll);
authRouter.get('/me', authenticateToken, AuthController.getProfile);
authRouter.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);

// MFA Endpoints
authRouter.post('/mfa/setup', authenticateToken, AuthController.setupMfa);
authRouter.post('/mfa/verify', authenticateToken, validateRequest(mfaVerifySchema), AuthController.verifyMfa);
authRouter.post('/mfa/disable', authenticateToken, AuthController.disableMfa);

// Session Management Endpoints
authRouter.get('/sessions', authenticateToken, AuthController.getSessions);
authRouter.delete('/sessions/:sessionId', authenticateToken, AuthController.revokeSession);

// Security Activity Log Endpoint
authRouter.get('/security/activity', authenticateToken, AuthController.getSecurityActivity);
