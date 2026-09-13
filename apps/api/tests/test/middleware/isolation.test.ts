import { Request, Response, NextFunction } from 'express';
import { authorizePermissions } from '../../src/middleware/auth';
import { storeScope } from '../../src/middleware/store';
import { AppError } from '../../src/middleware/error';
import { UserModel } from '../../src/models/User';
import { StoreModel } from '../../src/models/Store';
import { RbacService } from '../../src/services/rbac.service';

jest.mock('../../src/models/User');
jest.mock('../../src/models/Store');
jest.mock('../../src/services/rbac.service');

describe('Tenant and Store Isolation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
      query: {},
      user: {
        userId: 'user123',
        tenantId: 'tenantA',
        roles: ['admin'],
        sessionId: 'session123'
      }
    } as any;
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authorizePermissions (Cross-Tenant Prevention)', () => {
    it('should block access if X-Tenant-ID header does not match authenticated user tenant', async () => {
      req.headers!['x-tenant-id'] = 'tenantB'; // Malicious request trying to access tenantB data

      const middleware = authorizePermissions(['VIEW_PRODUCTS']);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toContain('Tenant isolation mismatch');
    });

    it('should proceed if X-Tenant-ID header matches and permissions allow', async () => {
      req.headers!['x-tenant-id'] = 'tenantA';
      (RbacService.getEffectivePermissions as jest.Mock).mockResolvedValue(['VIEW_PRODUCTS']);

      const middleware = authorizePermissions(['VIEW_PRODUCTS']);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(); // Called without error
    });
  });

  describe('storeScope (Store Isolation)', () => {
    it('should block access if store context is missing', async () => {
      // No x-store-id header, no storeId in body/query
      await storeScope(req as any, res as Response, next as NextFunction);
      
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toContain('Store context (X-Store-ID) required');
    });

    it('should block access if user does not have allowedStoreIds for the requested store', async () => {
      req.headers!['x-store-id'] = 'storeX';
      
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'user123',
        tenantId: 'tenantA',
        isOwner: false,
        allowedStoreIds: ['storeY'] // User only has access to storeY
      });

      await storeScope(req as any, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toContain('User does not have access to this store');
    });

    it('should block access if the requested store belongs to a different tenant', async () => {
      req.headers!['x-store-id'] = 'storeB';
      
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'user123',
        tenantId: 'tenantA',
        isOwner: true // Owner, so bypasses allowedStoreIds check, but store must belong to tenant
      });

      // Store belongs to tenantB, so findOne with tenantA will return null
      (StoreModel.findOne as jest.Mock).mockResolvedValue(null);

      await storeScope(req as any, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toContain('Store does not exist or does not belong to this tenant');
    });

    it('should proceed and attach storeId to request if access is valid', async () => {
      req.headers!['x-store-id'] = 'storeA';
      req.method = 'POST';
      
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'user123',
        tenantId: 'tenantA',
        isOwner: false,
        allowedStoreIds: ['storeA'] // Explicit access
      });

      (StoreModel.findOne as jest.Mock).mockResolvedValue({
        storeId: 'storeA',
        tenantId: 'tenantA'
      });

      await storeScope(req as any, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(); // Success
      expect((req as any).storeId).toBe('storeA');
      expect(req.body.storeId).toBe('storeA'); // Injected into body for POST
    });
  });
});
