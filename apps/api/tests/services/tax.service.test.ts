import { TaxService } from '../../src/services/tax.service';
import { StoreModel } from '../../src/models/Store';
import { runWithContext } from '../../src/utils/context';
import { connectTestDB, closeTestDB, clearTestDB } from '../utils/setupTestDB';

jest.setTimeout(30000);

describe('TaxService', () => {
  const tenantId = 'tenant_tax_1';
  const usStoreId = 'store_tax_us';
  const ukStoreId = 'store_tax_uk';
  const pkStoreId = 'store_tax_pk';

  beforeAll(async () => {
    await connectTestDB();

    await runWithContext({ tenantId, storeId: usStoreId }, async () => {
      await StoreModel.create({
        storeId: usStoreId,
        tenantId,
        name: 'US Store',
        slug: 'us-store',
        country: 'US',
        currency: 'USD',
        locale: 'en-US',
        timezone: 'UTC'
      });
    });

    await runWithContext({ tenantId, storeId: ukStoreId }, async () => {
      await StoreModel.create({
        storeId: ukStoreId,
        tenantId,
        name: 'UK Store',
        slug: 'uk-store',
        country: 'UK',
        currency: 'GBP',
        locale: 'en-GB',
        timezone: 'UTC'
      });
    });

    await runWithContext({ tenantId, storeId: pkStoreId }, async () => {
      await StoreModel.create({
        storeId: pkStoreId,
        tenantId,
        name: 'PK Store',
        slug: 'pk-store',
        country: 'PK',
        currency: 'PKR',
        locale: 'en-PK',
        timezone: 'UTC'
      });
    });
  });

  afterAll(async () => {
    await StoreModel.deleteMany({}).setOptions({ bypassScope: true });
    await closeTestDB();
  });

  it('should calculate 7% flat tax for US jurisdiction', async () => {
    await runWithContext({ tenantId, storeId: usStoreId }, async () => {
      const result = await TaxService.calculateTax({
        tenantId,
        storeId: usStoreId,
        subtotalMinor: 10000 // $100.00
      });
      expect(result.taxRate).toBe(0.07);
      expect(result.taxMinor).toBe(700); // 7% of 10000
    });
  });

  it('should calculate 20% VAT for UK jurisdiction', async () => {
    await runWithContext({ tenantId, storeId: ukStoreId }, async () => {
      const result = await TaxService.calculateTax({
        tenantId,
        storeId: ukStoreId,
        subtotalMinor: 10000
      });
      expect(result.taxRate).toBe(0.20);
      expect(result.taxMinor).toBe(2000); // 20% of 10000
    });
  });

  it('should calculate 0% tax for unhandled jurisdictions like PK', async () => {
    await runWithContext({ tenantId, storeId: pkStoreId }, async () => {
      const result = await TaxService.calculateTax({
        tenantId,
        storeId: pkStoreId,
        subtotalMinor: 10000
      });
      expect(result.taxRate).toBe(0);
      expect(result.taxMinor).toBe(0);
    });
  });

  it('should apply discount before tax calculation', async () => {
    await runWithContext({ tenantId, storeId: usStoreId }, async () => {
      const result = await TaxService.calculateTax({
        tenantId,
        storeId: usStoreId,
        subtotalMinor: 10000,
        discountMinor: 2000 // $20 discount
      });
      expect(result.taxMinor).toBe(560);
    });
  });

  it('should not allow negative taxable amounts', async () => {
    await runWithContext({ tenantId, storeId: usStoreId }, async () => {
      const result = await TaxService.calculateTax({
        tenantId,
        storeId: usStoreId,
        subtotalMinor: 10000,
        discountMinor: 15000 
      });
      expect(result.taxMinor).toBe(0);
    });
  });
});
