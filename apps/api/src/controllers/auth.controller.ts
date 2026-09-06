import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { PasswordResetService } from '../services/password-reset.service';
import { MfaService } from '../services/mfa.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { AuditLogModel } from '../models/AuditLog';
import { ApiResponse } from '@sellzy/shared';

export class AuthController {
  static async registerTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerTenant(req.body);
      const response: ApiResponse = { success: true, data: result };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await AuthService.login(req.body, userAgent, ipAddress);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.sessionId, req.user.userId, req.user.tenantId);
      }
      const response: ApiResponse = { success: true, data: { message: 'Logged out successfully' } };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logoutAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logoutAll(req.user.userId, req.user.tenantId);
      }
      const response: ApiResponse = { success: true, data: { message: 'Logged out from all devices' } };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PasswordResetService.requestPasswordReset(req.body.email, req.body.tenantSlug);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PasswordResetService.resetPassword(req.body.token, req.body.newPassword);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const user = await UserModel.findOne({ _id: req.user.userId, tenantId: req.user.tenantId });
      const response: ApiResponse = {
        success: true,
        data: {
          id: user?._id,
          tenantId: user?.tenantId,
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          roles: user?.roles,
          isOwner: user?.isOwner,
          mfaEnabled: user?.mfaEnabled,
          emailVerified: user?.emailVerified,
          status: user?.status,
          createdAt: user?.createdAt
        }
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.changePassword(req.user.userId, req.user.tenantId, req.body);
      }
      const response: ApiResponse = { success: true, data: { message: 'Password changed successfully' } };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async setupMfa(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const result = await MfaService.setupMfa(req.user.userId, req.user.tenantId);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async verifyMfa(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const result = await MfaService.verifyAndEnableMfa(req.user.userId, req.user.tenantId, req.body.token);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async disableMfa(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const result = await MfaService.disableMfa(req.user.userId, req.user.tenantId, true);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const sessions = await AuthService.getUserSessions(req.user.userId, req.user.tenantId, req.user.sessionId);
      const response: ApiResponse = { success: true, data: sessions };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async revokeSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.revokeSession(req.params.sessionId, req.user.userId, req.user.tenantId);
      }
      const response: ApiResponse = { success: true, data: { message: 'Session revoked' } };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getSecurityActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const logs = await AuditLogModel.find({ tenantId: req.user.tenantId, actorUserId: req.user.userId })
        .sort({ timestamp: -1 })
        .limit(20);
      const response: ApiResponse = { success: true, data: logs };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
