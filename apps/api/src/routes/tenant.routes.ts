import { Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { updateTenantSettingsSchema, inviteMemberSchema, switchTenantSchema } from '@sellzy/validation';

export const tenantRouter = Router();

// Protected Tenant & Membership Routes
tenantRouter.get('/tenant', authenticateToken, TenantController.getTenant);
tenantRouter.patch('/tenant/settings', authenticateToken, validateRequest(updateTenantSettingsSchema), TenantController.updateTenantSettings);
tenantRouter.post('/tenant/switch', authenticateToken, validateRequest(switchTenantSchema), TenantController.switchTenant);

// Members & Invitations
tenantRouter.get('/memberships', authenticateToken, requirePermission('users.view'), TenantController.getMembers);
tenantRouter.post('/invitations', authenticateToken, requirePermission('users.invite'), validateRequest(inviteMemberSchema), TenantController.inviteMember);

// Subscription & Usage Foundations
tenantRouter.get('/subscription', authenticateToken, TenantController.getSubscription);
tenantRouter.get('/usage', authenticateToken, TenantController.getUsage);
