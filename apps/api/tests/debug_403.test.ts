import request from 'supertest';
import { createApp } from '../src/app';
import jwt from 'jsonwebtoken';
import { env } from '@sellzy/config';
import { UserModel } from '../src/models/User';
import { StoreModel } from '../src/models/Store';
import { SessionModel } from '../src/models/Session';
import { RbacService } from '../src/services/rbac.service';

const app = createApp();

function mockQuery(result: any): any {
  return {
    exec: jest.fn().mockResolvedValue(result),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    then: (resolve: any) => Promise.resolve(result).then(resolve)
  };
}

describe('debug 403', () => {
  it('should print response', async () => {
    const tenantA = 'tn_analytics_a';
    const storeA = 'store_test_fallback';
    const userAdminA = 'usr_admin_analytics_a';
    const tokenAdminA = jwt.sign(
      { userId: userAdminA, tenantId: tenantA, roles: ['Owner'], sessionId: 'sess_analytics_a' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    jest.spyOn(UserModel, 'findOne').mockImplementation((filter: any) => {
      return mockQuery({ _id: userAdminA, tenantId: tenantA, status: 'ACTIVE', roles: ['Owner'], storeIds: [storeA] });
    });

    jest.spyOn(StoreModel, 'findOne').mockImplementation((filter: any) => {
      return mockQuery({ _id: storeA, tenantId: tenantA, status: 'ACTIVE' });
    });

    jest.spyOn(SessionModel, 'findOne').mockImplementation((filter: any) => {
      return mockQuery({
        _id: 'sess_analytics_a',
        sessionId: 'sess_analytics_a',
        userId: userAdminA,
        tenantId: tenantA,
        token: filter?.token || tokenAdminA,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000),
        save: jest.fn().mockResolvedValue(true)
      });
    });

    jest.spyOn(RbacService, 'getEffectivePermissions').mockImplementation(async (userId: string, tenantId: string) => {
      return ['*'];
    });

    const res = await request(app).get('/api/v1/analytics/overview').set('Authorization', `Bearer ${tokenAdminA}`).set('x-store-id', storeA);
    console.log('STATUS:', res.status);
    console.log('BODY:', res.body);
  });
});
