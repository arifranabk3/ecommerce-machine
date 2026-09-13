import mongoose from 'mongoose';
import { OrderService } from '../../src/services/order.service';
import { PricingService } from '../../src/services/pricing.service';
import { TaxService } from '../../src/services/tax.service';
import { ProductModel } from '../../src/models/Product';
import { StoreModel } from '../../src/models/Store';
import { OrderModel } from '../../src/models/Order';
import { OrderItemModel } from '../../src/models/OrderItem';
import { WarehouseModel } from '../../src/models/Warehouse';
import { InventoryModel } from '../../src/models/Inventory';
import { InventoryReservationModel } from '../../src/models/InventoryReservation';
import { OrderIdempotencyModel } from '../../src/models/OrderIdempotency';
import { runWithContext } from '../../src/utils/context';
import { OrderStatus, OrderSource, PaymentMethod, ReservationStatus } from '@sellzy/shared';
import { connectTestDB, closeTestDB } from '../utils/setupTestDB';

jest.setTimeout(30000);

describe('OrderService - Phase C', () => {
  const tenantId = 'tenant_order_1';
  const storeId = 'store_order_1';
  const warehouseId = new mongoose.Types.ObjectId().toString();
  let product1: any;

  beforeAll(async () => {
    await connectTestDB();
    await runWithContext({ tenantId, storeId }, async () => {
      await StoreModel.create({
        storeId,
        tenantId,
        name: 'Order Store',
        slug: 'order-store',
        country: 'US', // 7% tax
        currency: 'USD',
        locale: 'en-US',
        timezone: 'UTC'
      });

      await WarehouseModel.create({
        _id: warehouseId,
        tenantId,
        storeId,
        name: 'Main WH',
        code: 'WH-MAIN',
        normalizedCode: 'WH-MAIN',
        isActive: true,
        address: { country: 'US' }
      });
    });
  });

  afterAll(async () => {
    await StoreModel.deleteMany({}).setOptions({ bypassScope: true });
    await WarehouseModel.deleteMany({}).setOptions({ bypassScope: true });
    await closeTestDB();
  });

  beforeEach(async () => {
    await runWithContext({ tenantId, storeId }, async () => {
      product1 = await ProductModel.create({
        tenantId,
        storeId,
        name: 'Test Product 1',
        slug: 'test-product-1',
        sku: 'TP-1',
        normalizedSKU: 'TP-1',
        sellingPrice: 1000, // $10.00
        costPrice: 500
      });

      await InventoryModel.create({
        tenantId,
        storeId,
        productId: product1._id.toString(),
        warehouseId,
        quantityAvailable: 50
      });
    });
  });

  afterEach(async () => {
    await ProductModel.deleteMany({}).setOptions({ bypassScope: true });
    await OrderModel.deleteMany({}).setOptions({ bypassScope: true });
    await OrderItemModel.deleteMany({}).setOptions({ bypassScope: true });
    await InventoryModel.deleteMany({}).setOptions({ bypassScope: true });
    await InventoryReservationModel.deleteMany({}).setOptions({ bypassScope: true });
    await OrderIdempotencyModel.deleteMany({}).setOptions({ bypassScope: true });
  });

  const getValidOrderInput = (productId: string, idempotencyKey: string) => ({
    idempotencyKey,
    source: OrderSource.WEBSITE,
    channel: 'online',
    paymentMethod: PaymentMethod.PREPAID,
    customerId: 'cust_123',
    customerSnapshot: { name: 'John Doe', email: 'john@example.com' },
    locationId: warehouseId, // for inventory reservation
    items: [
      {
        productId,
        quantity: 2,
        discountMinor: 9999,
        taxMinor: 0
      }
    ],
    discountMinor: 9999,
    shippingMinor: 500, // $5.00 shipping
    taxMinor: 0,
    currency: 'USD'
  });

  it('should ignore client tampering and calculate authoritative totals', async () => {
    const input = getValidOrderInput(product1._id.toString(), 'idem_1');

    await runWithContext({ tenantId, storeId }, async () => {
      const { order, items } = await OrderService.createOrder(tenantId, input);

      expect(order.subtotalMinor).toBe(2000);
      expect(order.discountMinor).toBe(0);
      expect(order.shippingMinor).toBe(500);
      expect(order.taxMinor).toBe(140);
      expect(order.totalMinor).toBe(2640);
      expect(order.currency).toBe('USD');

      expect(items.length).toBe(1);
      expect(items[0].unitPriceMinor).toBe(1000);
      expect(items[0].discountMinor).toBe(0);
      expect(items[0].productNameSnapshot).toBe('Test Product 1');
    });
  });

  it('should maintain immutable item snapshots even if product price changes later', async () => {
    const input = getValidOrderInput(product1._id.toString(), 'idem_2');

    let orderId: string = '';
    await runWithContext({ tenantId, storeId }, async () => {
      const { order } = await OrderService.createOrder(tenantId, input);
      orderId = order._id.toString();
    });

    // Bypassing scope to blindly update product
    await ProductModel.updateOne({ _id: product1._id }, { $set: { sellingPrice: 2000 } }).setOptions({ bypassScope: true });

    await runWithContext({ tenantId, storeId }, async () => {
      const { order, items } = await OrderService.getOrderById(tenantId, orderId);
      
      expect(order.totalMinor).toBe(2640);
      expect(items[0].unitPriceMinor).toBe(1000);
    });
  });

  it('should be idempotent on identical order creation requests', async () => {
    const input = getValidOrderInput(product1._id.toString(), 'idem_3');

    await runWithContext({ tenantId, storeId }, async () => {
      const result1 = await OrderService.createOrder(tenantId, input);
      const result2 = await OrderService.createOrder(tenantId, input);

      expect(result1.order._id.toString()).toBe(result2.order._id.toString());
      
      const orderCount = await OrderModel.countDocuments({ tenantId });
      expect(orderCount).toBe(1);

      const reservations = await InventoryReservationModel.find({ tenantId, referenceId: result1.order._id.toString() });
      expect(reservations.length).toBe(1);
      expect(reservations[0].quantity).toBe(2);
    });
  });

  it('should release inventory when order is cancelled', async () => {
    const input = getValidOrderInput(product1._id.toString(), 'idem_4');

    let orderId: string = '';
    await runWithContext({ tenantId, storeId }, async () => {
      const { order } = await OrderService.createOrder(tenantId, input);
      orderId = order._id.toString();

      let reservations = await InventoryReservationModel.find({ tenantId, referenceId: orderId });
      expect(reservations.length).toBe(1);
      expect(reservations[0].status).toBe(ReservationStatus.ACTIVE);

      await OrderService.transitionOrderStatus(tenantId, orderId, OrderStatus.CANCELLED);

      reservations = await InventoryReservationModel.find({ tenantId, referenceId: orderId });
      expect(reservations[0].status).toBe(ReservationStatus.RELEASED);
    });
  });
});
