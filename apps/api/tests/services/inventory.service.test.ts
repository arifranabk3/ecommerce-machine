import { InventoryService } from '../../src/services/inventory.service';
import { InventoryModel } from '../../src/models/Inventory';
import { WarehouseModel } from '../../src/models/Warehouse';
import { ProductModel } from '../../src/models/Product';
import { InventoryMovementModel } from '../../src/models/InventoryMovement';
import { InventoryReservationModel } from '../../src/models/InventoryReservation';
import { connectTestDB, closeTestDB, clearTestDB } from '../utils/setupTestDB';
import { runWithContext } from '../../src/utils/context';
import { ProductType, ProductStatus } from '@sellzy/shared';

describe('InventoryService Isolation and Concurrency', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  const tenantA = 'tenant-A';
  const storeA = 'store-A';

  const setupData = async () => {
    return runWithContext({ tenantId: tenantA, storeId: storeA }, async () => {
      const warehouse = await WarehouseModel.create({
        tenantId: tenantA,
        storeId: storeA,
        name: 'Main Warehouse',
        code: 'MAIN-WH',
        normalizedCode: 'MAIN-WH',
        isDefault: true,
        isActive: true
      });

      const product = await ProductModel.create({
        tenantId: tenantA,
        storeId: storeA,
        name: 'Test Product',
        slug: 'test-product',
        sku: 'TEST-SKU-1',
        normalizedSKU: 'TEST-SKU-1',
        type: ProductType.SIMPLE,
        status: ProductStatus.ACTIVE,
        sellingPrice: 1000
      });

      return { warehouse, product };
    });
  };

  it('should adjust stock correctly with atomic ledger movement', async () => {
    const { warehouse, product } = await setupData();

    await runWithContext({ tenantId: tenantA, storeId: storeA }, async () => {
      const result = await InventoryService.adjustStock(tenantA, {
        productId: product._id.toString(),
        warehouseId: warehouse._id.toString(),
        quantityDelta: 10
      });

      expect(result.inventory.quantityOnHand).toBe(10);
      expect(result.inventory.quantityAvailable).toBe(10);
      expect(result.movement.quantityDelta).toBe(10);
      
      const movements = await InventoryMovementModel.find({ tenantId: tenantA, storeId: storeA });
      expect(movements.length).toBe(1);
    });
  });

  it('should prevent overselling via concurrent atomic reservations', async () => {
    const { warehouse, product } = await setupData();

    await runWithContext({ tenantId: tenantA, storeId: storeA }, async () => {
      // First, add exactly 5 items
      await InventoryService.adjustStock(tenantA, {
        productId: product._id.toString(),
        warehouseId: warehouse._id.toString(),
        quantityDelta: 5
      });

      // Try to reserve 3 items and 3 items concurrently
      const p1 = InventoryService.reserveStock(tenantA, {
        productId: product._id.toString(),
        warehouseId: warehouse._id.toString(),
        quantity: 3
      }).catch((e: any) => e.message);

      const p2 = InventoryService.reserveStock(tenantA, {
        productId: product._id.toString(),
        warehouseId: warehouse._id.toString(),
        quantity: 3
      }).catch((e: any) => e.message);

      const results = await Promise.all([p1, p2]);
      
      // One should succeed, one should fail
      const success = results.find((r: any) => typeof r !== 'string');
      const error = results.find((r: any) => typeof r === 'string');

      expect(success).toBeDefined();
      expect(error).toContain('Insufficient available stock');

      const inv = await InventoryModel.findOne({ tenantId: tenantA, productId: product._id });
      expect(inv!.quantityAvailable).toBe(2);
      expect(inv!.quantityReserved).toBe(3);
    });
  });

  it('should be idempotent for adjustments', async () => {
    const { warehouse, product } = await setupData();

    await runWithContext({ tenantId: tenantA, storeId: storeA }, async () => {
      await InventoryService.adjustStock(tenantA, {
        productId: product._id.toString(),
        warehouseId: warehouse._id.toString(),
        quantityDelta: 5,
        idempotencyKey: 'idem-123'
      });

      // Duplicate request
      await InventoryService.adjustStock(tenantA, {
        productId: product._id.toString(),
        warehouseId: warehouse._id.toString(),
        quantityDelta: 5,
        idempotencyKey: 'idem-123'
      });

      const inv = await InventoryModel.findOne({ tenantId: tenantA, productId: product._id });
      expect(inv!.quantityOnHand).toBe(5); // Not 10

      const movements = await InventoryMovementModel.find({ tenantId: tenantA });
      expect(movements.length).toBe(1); // Only one ledger entry
    });
  });
});
