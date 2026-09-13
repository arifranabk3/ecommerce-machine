import { PricingService } from '../../src/services/pricing.service';
import { ProductModel } from '../../src/models/Product';
import { ProductVariantModel } from '../../src/models/ProductVariant';
import { StoreModel } from '../../src/models/Store';
import { runWithContext } from '../../src/utils/context';
import { connectTestDB, closeTestDB, clearTestDB } from '../utils/setupTestDB';

jest.setTimeout(30000);

describe('PricingService', () => {
  const tenantId = 'tenant_pricing_1';
  const storeId = 'store_pricing_1';

  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await runWithContext({ tenantId, storeId }, async () => {
      await StoreModel.create({
        storeId,
        tenantId,
        name: 'Pricing Store',
        slug: 'pricing-store',
        country: 'US',
        currency: 'USD',
        locale: 'en-US',
        timezone: 'UTC'
      });
    });
  });

  afterEach(async () => {
    // Delete queries need context or bypassScope
    await StoreModel.deleteMany({}).setOptions({ bypassScope: true });
    await ProductModel.deleteMany({}).setOptions({ bypassScope: true });
    await ProductVariantModel.deleteMany({}).setOptions({ bypassScope: true });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should resolve base product price if no variant is provided', async () => {
    let product: any;
    await runWithContext({ tenantId, storeId }, async () => {
      product = await ProductModel.create({
        tenantId,
        storeId,
        name: 'Test Product',
        slug: 'test-product',
        sku: 'TEST-123',
        normalizedSKU: 'TEST-123',
        sellingPrice: 1500, // $15.00
        costPrice: 1000
      });
      
      const result = await PricingService.resolvePrice(tenantId, storeId, product._id.toString());
      expect(result.unitPriceMinor).toBe(1500);
      expect(result.currency).toBe('USD');
      expect(result.source).toBe('PRODUCT');
    });
  });

  it('should resolve variant price if variant is provided', async () => {
    await runWithContext({ tenantId, storeId }, async () => {
      const product = await ProductModel.create({
        tenantId,
        storeId,
        name: 'Test Product',
        slug: 'test-product-v',
        sku: 'TEST-456',
        normalizedSKU: 'TEST-456',
        sellingPrice: 1500,
        costPrice: 1000
      });

      const variant = await ProductVariantModel.create({
        tenantId,
        storeId,
        productId: product._id.toString(),
        name: 'Red Variant',
        sku: 'TEST-456-RED',
        normalizedSKU: 'TEST-456-RED',
        sellingPrice: 1800, // $18.00
        options: [{ name: 'Color', value: 'Red' }]
      });

      const result = await PricingService.resolvePrice(tenantId, storeId, product._id.toString(), variant._id.toString());
      expect(result.unitPriceMinor).toBe(1800);
      expect(result.currency).toBe('USD');
      expect(result.source).toBe('VARIANT');
    });
  });

  it('should throw an error if product is archived', async () => {
    await runWithContext({ tenantId, storeId }, async () => {
      const product = await ProductModel.create({
        tenantId,
        storeId,
        name: 'Archived Product',
        slug: 'archived-product',
        sku: 'ARCH-123',
        normalizedSKU: 'ARCH-123',
        sellingPrice: 1500,
        isArchived: true
      });

      await expect(PricingService.resolvePrice(tenantId, storeId, product._id.toString()))
        .rejects.toThrow('Product not found or is archived');
    });
  });
});
