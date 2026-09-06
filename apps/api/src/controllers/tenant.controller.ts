import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { InvitationService } from '../services/invitation.service';
import { EntitlementService } from '../services/entitlement.service';
import { TenantModel } from '../models/Tenant';
import { PlanModel } from '../models/Plan';
import { SubscriptionModel } from '../models/Subscription';
import { UsageTrackerModel } from '../models/UsageTracker';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { ApiResponse } from '@sellzy/shared';

export class TenantController {
  static async getTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const tenant = await TenantModel.findOne({ tenantId: req.user.tenantId });
      const response: ApiResponse = { success: true, data: tenant };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateTenantSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const updated = await AuthService.updateTenantSettings(req.user.tenantId, req.body);
      const response: ApiResponse = { success: true, data: updated };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async switchTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const result = await AuthService.switchTenant(req.user.userId, req.body.targetTenantId, req.user.sessionId);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async inviteMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const requestTenantId = req.headers['x-tenant-id'] as string;
      if (requestTenantId && requestTenantId !== req.user.tenantId) {
        throw new AppError('Forbidden: Tenant isolation mismatch', 403, 'TENANT_MISMATCH');
      }
      const invitation = await InvitationService.inviteMember(
        req.user.tenantId,
        req.body.email,
        req.body.role,
        req.user.userId
      );
      const response: ApiResponse = { success: true, data: invitation };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const members = await InvitationService.getTenantMembers(req.user.tenantId);
      const response: ApiResponse = { success: true, data: members };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const tenant = await TenantModel.findOne({ tenantId: req.user.tenantId });
      const subscription = await SubscriptionModel.findOne({ tenantId: req.user.tenantId });
      const plan = await PlanModel.findOne({ planId: tenant?.planId || 'STARTER' });
      
      const response: ApiResponse = {
        success: true,
        data: {
          tenantId: req.user.tenantId,
          plan,
          subscription
        }
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getUsage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const period = new Date().toISOString().substring(0, 7);
      const usageRecords = await UsageTrackerModel.find({ tenantId: req.user.tenantId, period });
      const response: ApiResponse = { success: true, data: usageRecords };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
