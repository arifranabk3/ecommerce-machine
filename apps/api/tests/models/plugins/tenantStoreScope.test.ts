import mongoose, { Schema } from 'mongoose';
import { tenantStoreScopePlugin } from '../../../src/models/plugins/tenantStoreScope';
import { runWithContext } from '../../../src/utils/context';
import { connectTestDB, closeTestDB, clearTestDB } from '../../utils/setupTestDB';

const testSchema = new Schema({
  name: String,
  tenantId: String,
  storeId: String
});

testSchema.plugin(tenantStoreScopePlugin);

const TestModel = mongoose.model('TestScope', testSchema);

describe('tenantStoreScopePlugin', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  it('should throw an error when querying without a context', async () => {
    await expect(TestModel.find({})).rejects.toThrow(/without active execution context/);
  });

  it('should automatically inject tenantId and storeId on creation', async () => {
    await runWithContext({ tenantId: 'tenantA', storeId: 'storeA' }, async () => {
      const doc = await TestModel.create({ name: 'Test Doc' });
      expect(doc.tenantId).toBe('tenantA');
      expect((doc as any).storeId).toBe('storeA');
    });
  });

  it('should automatically filter queries by the context', async () => {
    await runWithContext({ tenantId: 'tenantA', storeId: 'storeA' }, async () => {
      const doc1 = new TestModel({ name: 'Doc 1' });
      await doc1.save();
    });
    await runWithContext({ tenantId: 'tenantB', storeId: 'storeB' }, async () => {
      const doc2 = new TestModel({ name: 'Doc 2' });
      await doc2.save();
    });

    await runWithContext({ tenantId: 'tenantA', storeId: 'storeA' }, async () => {
      const docs = await TestModel.find({});
      expect(docs).toHaveLength(1);
      expect(docs[0].name).toBe('Doc 1');
    });

    await runWithContext({ tenantId: 'tenantB', storeId: 'storeB' }, async () => {
      const docs = await TestModel.find({});
      expect(docs).toHaveLength(1);
      expect(docs[0].name).toBe('Doc 2');
    });
  });
});
