import request from 'supertest';
import { createApp } from '../src/app';
import jwt from 'jsonwebtoken';
import { StoreModel } from '../src/models/Store';
import { UserModel } from '../src/models/User';
import { SessionModel } from '../src/models/Session';
import { TenantModel } from '../src/models/Tenant';
import { env } from '@sellzy/config';
import mongoose from 'mongoose';

const app = createApp();
const JWT_SECRET = env.JWT_SECRET || 'test_secret';

describe('Phase 15: Cross-Store Security Adversarial Verification', () => {
  const tenantId = new mongoose.Types.ObjectId().toString();
  const storeA = new mongoose.Types.ObjectId().toString();
  const storeB = new mongoose.Types.ObjectId().toString();
  
  const userA_id = new mongoose.Types.ObjectId().toString();
  const userB_id = new mongoose.Types.ObjectId().toString();
  const userNoStore_id = new mongoose.Types.ObjectId().toString();
  
  let tokenUserA: string;
  let tokenUserB: string;
  let tokenUserNoStore: string;
  
  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    
    // Generate valid JWT tokens
    const generateToken = (userId: string, roles = ['Owner']) => jwt.sign(
      { userId, tenantId, roles, sessionId: 'sess_test' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    tokenUserA = generateToken(userA_id, ['Member']);
    tokenUserB = generateToken(userB_id, ['Member']);
    tokenUserNoStore = generateToken(userNoStore_id, ['Member']);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    function mockQuery(data: any): any {
      return {
        exec: jest.fn().mockResolvedValue(data),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        then: (resolve: any) => Promise.resolve(data).then(resolve)
      };
    }

    jest.spyOn(TenantModel, 'findOne').mockReturnValue(mockQuery({ _id: tenantId, status: 'ACTIVE' }) as any);
    jest.spyOn(SessionModel, 'findOne').mockReturnValue(mockQuery({ 
      isValid: true, 
      expiresAt: new Date(Date.now() + 10000),
      save: jest.fn().mockResolvedValue(true)
    }) as any);

    const { RbacService } = require('../src/services/rbac.service');
    jest.spyOn(RbacService, 'getEffectivePermissions').mockResolvedValue(['orders.view', 'products.view', 'customers.view', 'analytics.view']);

    const { OrderModel } = require('../src/models/Order');
    jest.spyOn(OrderModel, 'find').mockReturnValue(mockQuery([]));
    jest.spyOn(OrderModel, 'countDocuments').mockReturnValue(mockQuery(0));
    const { ProductModel } = require('../src/models/Product');
    jest.spyOn(ProductModel, 'find').mockReturnValue(mockQuery([]));
    jest.spyOn(ProductModel, 'countDocuments').mockReturnValue(mockQuery(0));
    const { CustomerModel } = require('../src/models/Customer');
    jest.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery([]));
    jest.spyOn(CustomerModel, 'countDocuments').mockReturnValue(mockQuery(0));
    const { AnalyticsService } = require('../src/services/AnalyticsService');
    jest.spyOn(AnalyticsService, 'getOverview').mockResolvedValue({});

    // Provide mocked User models 
    jest.spyOn(UserModel, 'findOne').mockImplementation(((filter: any) => {
      if (filter && filter._id === userA_id) {
        return mockQuery({ _id: userA_id, tenantId, status: 'ACTIVE', roles: ['Member'], isOwner: false, allowedStoreIds: [storeA] });
      }
      if (filter && filter._id === userB_id) {
        return mockQuery({ _id: userB_id, tenantId, status: 'ACTIVE', roles: ['Member'], isOwner: false, allowedStoreIds: [storeB] });
      }
      if (filter && filter._id === userNoStore_id) {
        return mockQuery({ _id: userNoStore_id, tenantId, status: 'ACTIVE', roles: ['Member'], isOwner: false, allowedStoreIds: [] });
      }
      return mockQuery(null);
    }) as any);

    // Provide mocked Store models
    jest.spyOn(StoreModel, 'findOne').mockImplementation(((filter: any) => {
      if (filter && filter._id === storeA) {
        return mockQuery({ _id: storeA, storeId: storeA, tenantId, status: 'ACTIVE' });
      }
      if (filter && filter._id === storeB) {
        return mockQuery({ _id: storeB, storeId: storeB, tenantId, status: 'ACTIVE' });
      }
      return mockQuery(null);
    }) as any);
  });

  describe('1. Explicit Store Boundary Enforcement', () => {
    it('1.1 User A can access Store A correctly', async () => {
      // Assuming GET /api/v1/orders is a tenant/store scoped route
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .set('x-store-id', storeA);
      
      // If the route is not mocked, it might return empty array (200) or missing permissions depending on route definition,
      // but it MUST NOT return 400 or 403 (STORE_ACCESS_DENIED) from storeScope.
      // We expect the request to pass storeScope validation. 
      // If it fails RBAC later, it returns 403 with "Permission X required", not "User does not have access to this store".
      // Let's just check it doesn't return 400 or the STORE_ACCESS_DENIED message.
      expect(res.body?.error?.message).not.toMatch(/User does not have access to this store/);
      expect(res.status).not.toBe(400); 
    });

    it('1.2 User A accessing Store B MUST return 403 STORE_ACCESS_DENIED', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .set('x-store-id', storeB);
      
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('STORE_ACCESS_DENIED');
      expect(res.body.error.message).toBe('Forbidden: User does not have access to this store');
    });

    const targetEndpoints = [
      '/api/v1/analytics/overview',
      '/api/v1/analytics/customers',
      '/api/v1/orders',
      '/api/v1/products',
      '/api/v1/customers',
    ];

    targetEndpoints.forEach(endpoint => {
      it(`1.3 Attack: User A attempting cross-store fetch on ${endpoint} -> 403`, async () => {
        const res = await request(app)
          .get(endpoint)
          .set('Authorization', `Bearer ${tokenUserA}`)
          .set('x-store-id', storeB);
        
        expect(res.status).toBe(403);
        expect(res.body.error.code).toBe('STORE_ACCESS_DENIED');
      });
    });

    it('1.4 Missing x-store-id header -> 400 Bad Request', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${tokenUserA}`);
      
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/x-store-id header is required/);
    });

    it('1.5 Invalid store ID -> 403 STORE_ACCESS_DENIED', async () => {
      const invalidStoreId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .set('x-store-id', invalidStoreId);
      
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('STORE_ACCESS_DENIED');
    });

    it('1.6 Valid user with no allowed stores -> 403 STORE_ACCESS_DENIED', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${tokenUserNoStore}`)
        .set('x-store-id', storeA);
      
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('STORE_ACCESS_DENIED');
    });
    
    it('1.7 Non-owner member with unauthorized store -> 403 STORE_ACCESS_DENIED', async () => {
      // Modify mock for User A to be non-owner
      jest.spyOn(UserModel, 'findOne').mockImplementation(((filter: any) => {
        const mockQuery = (data: any) => ({
          exec: jest.fn().mockResolvedValue(data),
          lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(data) }),
        });
        if (filter && filter._id === userA_id) {
          return mockQuery({ _id: userA_id, tenantId, status: 'ACTIVE', roles: ['Member'], isOwner: false, allowedStoreIds: [storeA] });
        }
        return mockQuery(null);
      }) as any);

      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .set('x-store-id', storeB);
      
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('STORE_ACCESS_DENIED');
    });
  });
});
