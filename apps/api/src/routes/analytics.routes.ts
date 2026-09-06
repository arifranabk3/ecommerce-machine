import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { ReportExportService } from '../services/ReportExportService';
import { SavedReportModel } from '../models/SavedReport';
import { AnalyticsSnapshotModel } from '../models/AnalyticsSnapshot';
import { AnalyticsAlertModel } from '../models/AnalyticsAlert';
import { MetricDefinitionService } from '../services/MetricDefinitionService';
import { RbacService } from '../services/rbac.service';
import { AppError } from '../middleware/error';
import { authenticateToken } from '../middleware/auth';
import { AnalyticsReportType, AnalyticsExportFormat } from '@sellzy/shared';

const router = Router();

router.use(authenticateToken);

// Middleware helper to enforce RBAC permissions
function requirePermission(permissionKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPermissions = await RbacService.getEffectivePermissions(
        (req as any).user.userId,
        (req as any).user.tenantId
      );
      if (!userPermissions.includes('*') && !userPermissions.includes(permissionKey)) {
        return next(new AppError(`Permission ${permissionKey} required`, 403, 'FORBIDDEN'));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * GET /api/v1/analytics/overview
 */
router.get('/overview', requirePermission('analytics.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getOverview(tenantId, req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/sales
 */
router.get('/sales', requirePermission('analytics.sales.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getSalesAnalytics(tenantId, req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/orders
 */
router.get('/orders', requirePermission('analytics.orders.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getOrderAnalytics(tenantId, req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/profit
 */
router.get('/profit', requirePermission('analytics.profit.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getProfitAnalytics(tenantId, req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/products
 */
router.get('/products', requirePermission('analytics.products.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getProductAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/inventory
 */
router.get('/inventory', requirePermission('analytics.inventory.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getProductAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/customers
 */
router.get('/customers', requirePermission('analytics.customers.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getCustomerAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/vendors
 */
router.get('/vendors', requirePermission('analytics.vendors.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getVendorAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/procurement
 */
router.get('/procurement', requirePermission('analytics.procurement.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getVendorAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/payments
 */
router.get('/payments', requirePermission('analytics.payments.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getPaymentAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/shipping
 */
router.get('/shipping', requirePermission('analytics.shipping.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getShippingAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/returns
 */
router.get('/returns', requirePermission('analytics.returns.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getShippingAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/marketing
 */
router.get('/marketing', requirePermission('analytics.marketing.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getMarketingAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/automation
 */
router.get('/automation', requirePermission('analytics.automation.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getAutomationAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/exceptions
 */
router.get('/exceptions', requirePermission('analytics.exceptions.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const data = await AnalyticsService.getAutomationAnalytics(tenantId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * Saved Reports API
 */
router.post('/reports', requirePermission('analytics.reports.create'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    const { name, reportType, metrics, dimensions, filters, isScheduled, scheduleConfig } = req.body;

    if (!name || !reportType || !metrics) {
      return next(new AppError('Missing required report builder parameters', 400, 'BAD_REQUEST'));
    }

    const report = await SavedReportModel.create({
      tenantId,
      name,
      reportType,
      metrics,
      dimensions,
      filters,
      createdBy: userId,
      isScheduled,
      scheduleConfig
    });

    res.status(201).json({ success: true, report });
  } catch (err) {
    next(err);
  }
});

router.get('/reports', requirePermission('analytics.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const reports = await SavedReportModel.find({ tenantId }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/analytics/metrics
 */
router.get('/metrics', requirePermission('analytics.view'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = MetricDefinitionService.getAll();
    res.json({ success: true, metrics });
  } catch (err) {
    next(err);
  }
});

/**
 * Export API
 */
router.post('/exports', requirePermission('analytics.export'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    const { reportType, format } = req.body;

    if (!reportType || !format) {
      return next(new AppError('Missing reportType or format for export', 400, 'BAD_REQUEST'));
    }

    const job = await ReportExportService.requestExport(tenantId, userId, reportType, format);
    res.status(202).json({ success: true, job });
  } catch (err) {
    next(err);
  }
});

router.get('/exports/:id', requirePermission('analytics.export'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const job = await ReportExportService.getJob(tenantId, req.params.id);
    if (!job) {
      return next(new AppError('Export job not found', 404, 'NOT_FOUND'));
    }
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
});

export const analyticsRouter = router;
