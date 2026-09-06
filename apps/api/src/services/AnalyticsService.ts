import mongoose from 'mongoose';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/Customer';
import { InventoryModel } from '../models/Inventory';
import { ProductModel } from '../models/Product';
import { VendorLedgerEntryModel } from '../models/VendorLedgerEntry';
import { PurchaseOrderModel } from '../models/PurchaseOrder';
import { PaymentModel } from '../models/Payment';
import { RefundModel } from '../models/Refund';
import { ShipmentModel } from '../models/Shipment';
import { ReturnToOriginModel } from '../models/ReturnToOrigin';
import { CustomerReturnModel } from '../models/CustomerReturn';
import { CampaignModel } from '../models/Campaign';
import { MessageModel } from '../models/Message';
import { AutomationRunModel } from '../models/AutomationRun';
import { AutomationExceptionModel } from '../models/AutomationException';
import { AnalyticsCacheService } from './AnalyticsCacheService';

export interface IAnalyticsFilterOptions {
  startDate?: Date;
  endDate?: Date;
  productId?: string;
  vendorId?: string;
  customerId?: string;
  paymentMethod?: string;
  courierId?: string;
  currency?: string;
  [key: string]: unknown;
}

export interface ISalesAnalytics {
  tenantId: string;
  currency: string;
  grossSalesMinor: number;
  discountsMinor: number;
  shippingMinor: number;
  taxMinor: number;
  refundsMinor: number;
  netSalesMinor: number;
  totalOrders: number;
  totalUnits: number;
  aovMinor: number;
}

export class AnalyticsService {
  /**
   * Helper to build tenant-isolated and date-bounded query criteria
   */
  private static buildBaseCriteria(tenantId: string, options: IAnalyticsFilterOptions = {}): any {
    const match: any = { tenantId };
    if (options.startDate || options.endDate) {
      match.createdAt = {};
      if (options.startDate) match.createdAt.$gte = new Date(options.startDate);
      if (options.endDate) match.createdAt.$lte = new Date(options.endDate);
    }
    if (options.productId) match['items.productId'] = options.productId;
    if (options.vendorId) match.vendorId = options.vendorId;
    if (options.customerId) match.customerId = options.customerId;
    if (options.paymentMethod) match.paymentMethod = options.paymentMethod;
    if (options.currency) match.currency = options.currency;
    return match;
  }

  /**
   * Sales & Revenue Analytics (Uses OrderModel & PaymentModel)
   */
  static async getSalesAnalytics(tenantId: string, options: IAnalyticsFilterOptions = {}): Promise<ISalesAnalytics> {
    const cached = await AnalyticsCacheService.get<ISalesAnalytics>(tenantId, 'sales', options);
    if (cached) return cached;

    const match = this.buildBaseCriteria(tenantId, options);
    match.status = { $nin: ['CANCELLED', 'FAILED'] };

    const result = await OrderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          grossSalesMinor: { $sum: '$subtotalMinor' },
          discountsMinor: { $sum: '$discountMinor' },
          shippingMinor: { $sum: '$shippingMinor' },
          taxMinor: { $sum: '$taxMinor' },
          netSalesMinor: { $sum: '$totalMinor' },
          totalOrders: { $sum: 1 },
          totalUnits: { $sum: '$itemCount' }
        }
      }
    ]);

    const refunds = await RefundModel.aggregate([
      { $match: { tenantId, status: 'SUCCEEDED' } },
      { $group: { _id: null, totalRefundsMinor: { $sum: '$amountMinor' } } }
    ]);

    const data = result[0] || {
      grossSalesMinor: 0,
      discountsMinor: 0,
      shippingMinor: 0,
      taxMinor: 0,
      netSalesMinor: 0,
      totalOrders: 0,
      totalUnits: 0
    };

    const totalRefundsMinor = refunds[0]?.totalRefundsMinor || 0;
    const aovMinor = data.totalOrders > 0 ? Math.round(data.netSalesMinor / data.totalOrders) : 0;

    const resPayload = {
      tenantId,
      currency: options.currency || 'USD',
      grossSalesMinor: data.grossSalesMinor,
      discountsMinor: data.discountsMinor,
      shippingMinor: data.shippingMinor,
      taxMinor: data.taxMinor,
      refundsMinor: totalRefundsMinor,
      netSalesMinor: Math.max(0, data.netSalesMinor - totalRefundsMinor),
      totalOrders: data.totalOrders,
      totalUnits: data.totalUnits,
      aovMinor
    };

    await AnalyticsCacheService.set(tenantId, 'sales', options, resPayload);
    return resPayload;
  }

  /**
   * Order Status Breakdown Analytics
   */
  static async getOrderAnalytics(tenantId: string, options: IAnalyticsFilterOptions = {}) {
    const match = this.buildBaseCriteria(tenantId, options);

    const breakdown = await OrderModel.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 }, totalMinor: { $sum: '$totalMinor' } } }
    ]);

    const statusCounts: Record<string, number> = {};
    let total = 0;

    breakdown.forEach((item) => {
      statusCounts[item._id] = item.count;
      total += item.count;
    });

    return {
      tenantId,
      totalOrders: total,
      statusBreakdown: statusCounts,
      raw: breakdown
    };
  }

  /**
   * Profit & Margin Analytics (Minor integer units precision)
   */
  static async getProfitAnalytics(tenantId: string, options: IAnalyticsFilterOptions = {}) {
    const sales = await this.getSalesAnalytics(tenantId, options);
    
    // Calculate Vendor COGS from Vendor Ledger Entries
    const ledger = await VendorLedgerEntryModel.aggregate([
      { $match: { tenantId, type: 'PURCHASE' } },
      { $group: { _id: null, totalCogsMinor: { $sum: '$amountMinor' } } }
    ]);
    const cogsMinor = ledger[0]?.totalCogsMinor || 0;

    // Calculate Courier Shipping Costs
    const shipments = await ShipmentModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, totalShippingCostMinor: { $sum: '$shippingFeeMinor' } } }
    ]);
    const shippingCostMinor = shipments[0]?.totalShippingCostMinor || 0;

    const grossProfitMinor = sales.netSalesMinor - cogsMinor;
    const contributionProfitMinor = grossProfitMinor - shippingCostMinor - sales.refundsMinor;

    return {
      tenantId,
      currency: sales.currency,
      netSalesMinor: sales.netSalesMinor,
      cogsMinor,
      grossProfitMinor,
      shippingCostMinor,
      refundsMinor: sales.refundsMinor,
      contributionProfitMinor,
      marginPercentage: sales.netSalesMinor > 0 ? Number(((grossProfitMinor / sales.netSalesMinor) * 100).toFixed(2)) : 0
    };
  }

  /**
   * Product & Inventory Analytics
   */
  static async getProductAnalytics(tenantId: string) {
    const totalProducts = await ProductModel.countDocuments({ tenantId, status: { $ne: 'ARCHIVED' } });
    const stockStats = await InventoryModel.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: null,
          totalAvailable: { $sum: '$available' },
          totalReserved: { $sum: '$reserved' },
          totalInventory: { $sum: '$onHand' },
          inventoryValueMinor: { $sum: { $multiply: ['$onHand', '$costPriceMinor'] } }
        }
      }
    ]);

    const data = stockStats[0] || { totalAvailable: 0, totalReserved: 0, totalInventory: 0, inventoryValueMinor: 0 };

    return {
      tenantId,
      totalProducts,
      totalAvailableStock: data.totalAvailable,
      totalReservedStock: data.totalReserved,
      totalOnHandStock: data.totalInventory,
      totalInventoryValueMinor: data.inventoryValueMinor
    };
  }

  /**
   * Customer Cohorts & CRM Analytics
   */
  static async getCustomerAnalytics(tenantId: string) {
    const totalCustomers = await CustomerModel.countDocuments({ tenantId });
    const repeatCustomers = await CustomerModel.countDocuments({ tenantId, totalOrders: { $gt: 1 } });

    const spendStats = await CustomerModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, totalSpentMinor: { $sum: '$totalSpentMinor' }, avgOrders: { $avg: '$totalOrders' } } }
    ]);

    const data = spendStats[0] || { totalSpentMinor: 0, avgOrders: 0 };
    const repeatRate = totalCustomers > 0 ? Number(((repeatCustomers / totalCustomers) * 100).toFixed(2)) : 0;
    const ltvMinor = totalCustomers > 0 ? Math.round(data.totalSpentMinor / totalCustomers) : 0;

    return {
      tenantId,
      totalCustomers,
      repeatCustomers,
      repeatPurchaseRate: repeatRate,
      averageLtvMinor: ltvMinor,
      averageOrdersPerCustomer: Number(data.avgOrders.toFixed(2))
    };
  }

  /**
   * Vendor & Payable Analytics (Phase 08/09 Reconciliation)
   */
  static async getVendorAnalytics(tenantId: string) {
    const ledgerTotals = await VendorLedgerEntryModel.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: null,
          totalPurchasesMinor: { $sum: { $cond: [{ $eq: ['$type', 'PURCHASE'] }, '$amountMinor', 0] } },
          totalPaymentsMinor: { $sum: { $cond: [{ $eq: ['$type', 'PAYMENT'] }, '$amountMinor', 0] } },
          totalAdjustmentsMinor: { $sum: { $cond: [{ $eq: ['$type', 'ADJUSTMENT'] }, '$amountMinor', 0] } }
        }
      }
    ]);

    const poCounts = await PurchaseOrderModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalValueMinor: { $sum: '$totalMinor' } } }
    ]);

    const data = ledgerTotals[0] || { totalPurchasesMinor: 0, totalPaymentsMinor: 0, totalAdjustmentsMinor: 0 };
    const outstandingPayableMinor = Math.max(0, data.totalPurchasesMinor - data.totalPaymentsMinor + data.totalAdjustmentsMinor);

    return {
      tenantId,
      totalPurchasesMinor: data.totalPurchasesMinor,
      totalPaymentsMinor: data.totalPaymentsMinor,
      outstandingPayableMinor,
      poStatusBreakdown: poCounts
    };
  }

  /**
   * Payment & Refund Success Rate Analytics
   */
  static async getPaymentAnalytics(tenantId: string) {
    const attempts = await PaymentModel.countDocuments({ tenantId });
    const successful = await PaymentModel.countDocuments({ tenantId, status: { $in: ['CAPTURED', 'PAID'] } });
    const failed = await PaymentModel.countDocuments({ tenantId, status: 'FAILED' });
    const totalRefunds = await RefundModel.countDocuments({ tenantId, status: 'SUCCEEDED' });

    const successRate = attempts > 0 ? Number(((successful / attempts) * 100).toFixed(2)) : 0;

    return {
      tenantId,
      totalPaymentAttempts: attempts,
      successfulPayments: successful,
      failedPayments: failed,
      paymentSuccessRate: successRate,
      totalRefundsProcessed: totalRefunds
    };
  }

  /**
   * Shipping, Courier & RTO Analytics
   */
  static async getShippingAnalytics(tenantId: string) {
    const totalShipments = await ShipmentModel.countDocuments({ tenantId });
    const delivered = await ShipmentModel.countDocuments({ tenantId, status: 'DELIVERED' });
    const rtoCount = await ReturnToOriginModel.countDocuments({ tenantId });
    const customerReturns = await CustomerReturnModel.countDocuments({ tenantId });

    const deliverySuccessRate = totalShipments > 0 ? Number(((delivered / totalShipments) * 100).toFixed(2)) : 0;
    const rtoRate = totalShipments > 0 ? Number(((rtoCount / totalShipments) * 100).toFixed(2)) : 0;

    return {
      tenantId,
      totalShipments,
      deliveredShipments: delivered,
      deliverySuccessRate,
      rtoCount,
      rtoRate,
      customerReturnRequests: customerReturns
    };
  }

  /**
   * Marketing & Communication Analytics
   */
  static async getMarketingAnalytics(tenantId: string) {
    const campaignsCount = await CampaignModel.countDocuments({ tenantId });
    const messagesCount = await MessageModel.countDocuments({ tenantId });

    return {
      tenantId,
      totalCampaigns: campaignsCount,
      totalMessagesSent: messagesCount
    };
  }

  /**
   * Automation & Exception Health Analytics
   */
  static async getAutomationAnalytics(tenantId: string) {
    const totalRuns = await AutomationRunModel.countDocuments({ tenantId });
    const successfulRuns = await AutomationRunModel.countDocuments({ tenantId, status: 'COMPLETED' });
    const failedRuns = await AutomationRunModel.countDocuments({ tenantId, status: 'FAILED' });
    const openExceptions = await AutomationExceptionModel.countDocuments({ tenantId, status: 'OPEN' });

    const successRate = totalRuns > 0 ? Number(((successfulRuns / totalRuns) * 100).toFixed(2)) : 0;

    return {
      tenantId,
      totalWorkflowExecutions: totalRuns,
      successfulExecutions: successfulRuns,
      failedExecutions: failedRuns,
      automationSuccessRate: successRate,
      openExceptionsCount: openExceptions
    };
  }

  /**
   * Dashboard Overview (Combines key KPIs accurately)
   */
  static async getOverview(tenantId: string, options: IAnalyticsFilterOptions = {}) {
    const sales = await this.getSalesAnalytics(tenantId, options);
    const profit = await this.getProfitAnalytics(tenantId, options);
    const shipping = await this.getShippingAnalytics(tenantId);
    const vendors = await this.getVendorAnalytics(tenantId);

    return {
      tenantId,
      netSalesMinor: sales.netSalesMinor,
      totalOrders: sales.totalOrders,
      aovMinor: sales.aovMinor,
      contributionProfitMinor: profit.contributionProfitMinor,
      deliverySuccessRate: shipping.deliverySuccessRate,
      rtoRate: shipping.rtoRate,
      outstandingVendorPayableMinor: vendors.outstandingPayableMinor
    };
  }
}
