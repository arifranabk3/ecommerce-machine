import { SaaSPlanModel } from '../models/Plan';
import { SaaSSubscriptionModel } from '../models/Subscription';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { CustomerModel } from '../models/Customer';
import { UserModel } from '../models/User';
import { AppError } from '../middleware/error';

export interface IUsageSummary {
  tenantId: string;
  planSlug: string;
  usage: {
    productsCount: number;
    usersCount: number;
    ordersMonthlyCount: number;
    customersCount: number;
  };
  limits: {
    productsMax: number;
    usersMax: number;
    ordersMonthly: number;
    customersMax: number;
  };
}

export class EntitlementService {
  /**
   * Fetch current active plan & limits for a tenant
   */
  static async getTenantPlan(tenantId: string) {
    const sub = await SaaSSubscriptionModel.findOne({ tenantId });
    if (sub?.planId) {
      const plan = await SaaSPlanModel.findById(sub.planId);
      if (plan) return plan;
    }
    // Fallback default starter plan limits
    return {
      name: 'Starter Plan',
      slug: 'STARTER',
      limits: {
        productsMax: 100,
        usersMax: 5,
        ordersMonthly: 1000,
        customersMax: 1000,
        vendorsMax: 10,
        locationsMax: 2,
        automationMax: 10,
        messagesMonthly: 500,
        campaignsMax: 5,
        storageMaxMb: 1024,
        apiRequestsMonthly: 10000,
        exportsMonthly: 50,
        scheduledReportsMax: 5
      }
    };
  }

  /**
   * Get current real-time tenant resource consumption
   */
  static async getTenantUsage(tenantId: string): Promise<IUsageSummary> {
    const plan = await this.getTenantPlan(tenantId);
    
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const productsCount = await ProductModel.countDocuments({ tenantId, status: { $ne: 'ARCHIVED' } });
    const usersCount = await UserModel.countDocuments({ tenantId, status: 'ACTIVE' });
    const ordersMonthlyCount = await OrderModel.countDocuments({ tenantId, createdAt: { $gte: startOfMonth } });
    const customersCount = await CustomerModel.countDocuments({ tenantId });

    return {
      tenantId,
      planSlug: plan.slug || 'STARTER',
      usage: {
        productsCount,
        usersCount,
        ordersMonthlyCount,
        customersCount
      },
      limits: {
        productsMax: plan.limits.productsMax,
        usersMax: plan.limits.usersMax,
        ordersMonthly: plan.limits.ordersMonthly,
        customersMax: plan.limits.customersMax
      }
    };
  }

  /**
   * Atomic check & enforce limit before resource creation
   */
  static async checkAndEnforceLimit(tenantId: string, resource: 'products' | 'users' | 'orders' | 'customers'): Promise<void> {
    const usage = await this.getTenantUsage(tenantId);

    switch (resource) {
      case 'products':
        if (usage.usage.productsCount >= usage.limits.productsMax) {
          throw new AppError(`Product limit of ${usage.limits.productsMax} reached for current plan`, 403, 'LIMIT_EXCEEDED');
        }
        break;
      case 'users':
        if (usage.usage.usersCount >= usage.limits.usersMax) {
          throw new AppError(`User account limit of ${usage.limits.usersMax} reached for current plan`, 403, 'LIMIT_EXCEEDED');
        }
        break;
      case 'orders':
        if (usage.usage.ordersMonthlyCount >= usage.limits.ordersMonthly) {
          throw new AppError(`Monthly order limit of ${usage.limits.ordersMonthly} reached for current plan`, 403, 'LIMIT_EXCEEDED');
        }
        break;
      case 'customers':
        if (usage.usage.customersCount >= usage.limits.customersMax) {
          throw new AppError(`Customer limit of ${usage.limits.customersMax} reached for current plan`, 403, 'LIMIT_EXCEEDED');
        }
        break;
    }
  }
}
