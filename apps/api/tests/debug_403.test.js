const request = require('supertest');
const { createApp } = require('../src/app');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');
const { UserModel } = require('../src/models/User');
const { StoreModel } = require('../src/models/Store');
const { SessionModel } = require('../src/models/Session');

const app = createApp();
const tenantA = 'tn_analytics_a';
const storeA = 'store_test_fallback';
const userAdminA = 'usr_admin_analytics_a';

const tokenAdminA = jwt.sign(
  { userId: userAdminA, tenantId: tenantA, roles: ['Owner'], sessionId: 'sess_analytics_a' },
  env.JWT_SECRET,
  { expiresIn: '1h' }
);

function mockQuery(result) {
  return {
    exec: jest.fn().mockResolvedValue(result),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    then: (resolve) => Promise.resolve(result).then(resolve)
  };
}

async function run() {
  jest.spyOn(UserModel, 'findOne').mockImplementation((filter) => {
    return mockQuery({ _id: userAdminA, tenantId: tenantA, status: 'ACTIVE', roles: ['Owner'], storeIds: [storeA] });
  });

  jest.spyOn(StoreModel, 'findOne').mockImplementation((filter) => {
    return mockQuery({ _id: storeA, tenantId: tenantA, status: 'ACTIVE' });
  });

  jest.spyOn(SessionModel, 'findOne').mockImplementation((filter) => {
    return mockQuery({
      _id: 'sess_analytics_a',
      sessionId: 'sess_analytics_a',
      userId: userAdminA,
      tenantId: tenantA,
      status: 'ACTIVE'
    });
  });

  const res = await request(app).get('/api/v1/analytics/overview').set('Authorization', `Bearer ${tokenAdminA}`).set('x-store-id', storeA);
  console.log('STATUS:', res.status);
  console.log('BODY:', res.body);
}

run().catch(console.error);
