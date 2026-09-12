import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from '@sellzy/config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { tenantRouter } from './routes/tenant.routes';
import storefrontRouter from './routes/storefront.routes';
import userRouter from './routes/user.routes';
import roleRouter from './routes/role.routes';
import permissionRouter from './routes/permission.routes';
import productRouter from './routes/product.routes';
import categoryRouter from './routes/category.routes';
import locationRouter from './routes/location.routes';
import inventoryRouter from './routes/inventory.routes';
import { orderRoutes } from './routes/order.routes';
import { fulfillmentRoutes } from './routes/fulfillment.routes';
import customerRoutes from './routes/customer.routes';
import vendorRouter from './routes/vendor.routes';
import procurementRouter from './routes/procurement.routes';
import vendorLedgerRouter from './routes/vendor-ledger.routes';
import paymentRouter, { refundRouter, financeRouter } from './routes/payment.routes';
import shippingRouter, { returnsRouter, courierSettingsRouter } from './routes/shipping.routes';
import communicationRouter from './routes/communication.routes';
import automationRouter from './routes/automation.routes';
import approvalRouter from './routes/approval.routes';
import exceptionRouter from './routes/exception.routes';
import aiRouter from './routes/ai.routes';

import { analyticsRouter } from './routes/analytics.routes';
import { platformRouter } from './routes/platform.routes';
import { tenantBillingRouter } from './routes/tenantBilling.routes';

export function createApp(): Application {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' } }
  });
  app.use(limiter);

  // Request Body Parsers & Size Limits
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Logger Middleware
  app.use(pinoHttp({ logger }));

  // Health & Probe Endpoints
  app.get('/live', (_req, res) => { res.json({ status: 'alive', timestamp: new Date().toISOString() }); });
  app.get('/ready', (_req, res) => { res.json({ status: 'ready', timestamp: new Date().toISOString() }); });

  // API Versioning Routes
  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/roles', roleRouter);
  app.use('/api/v1/permissions', permissionRouter);
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/locations', locationRouter);
  app.use('/api/v1/inventory', inventoryRouter);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/fulfillments', fulfillmentRoutes);
  app.use('/api/v1/customers', customerRoutes);
  app.use('/api/v1/vendors', vendorRouter);
  app.use('/api/v1/vendors', vendorLedgerRouter);
  app.use('/api/v1/procurement', procurementRouter);
  app.use('/api/v1/payments', paymentRouter);
  app.use('/api/v1/refunds', refundRouter);
  app.use('/api/v1/finance', financeRouter);
  app.use('/api/v1/shipping', shippingRouter);
  app.use('/api/v1/returns', returnsRouter);
  app.use('/api/v1/settings/couriers', courierSettingsRouter);
  app.use('/api/v1/communication', communicationRouter);
  app.use('/api/v1/automation', automationRouter);
  app.use('/api/v1/approvals', approvalRouter);
  app.use('/api/v1/exceptions', exceptionRouter);
  app.use('/api/v1/ai', aiRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1/platform', platformRouter);
  app.use('/api/v1', tenantBillingRouter);
  app.use('/api/v1', vendorLedgerRouter);
  app.use('/api/v1/storefront', storefrontRouter);
  app.use('/api/v1', tenantRouter);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
