import { InventoryModel, IInventoryDocument } from '../models/Inventory';
import { InventoryMovementModel, IInventoryMovementDocument } from '../models/InventoryMovement';
import { InventoryReservationModel, IInventoryReservationDocument } from '../models/InventoryReservation';
import { ProductModel } from '../models/Product';
import { ProductVariantModel } from '../models/ProductVariant';
import { WarehouseModel } from '../models/Warehouse';
import { AppError } from '../middleware/error';
import { SecurityService } from './security.service';
import { SystemEvents, InventoryMovementType, ReservationStatus, StockStatus } from '@sellzy/shared';

export interface IAdjustStockInput {
  productId: string;
  variantId?: string | null;
  warehouseId: string;
  quantityDelta: number;
  type?: InventoryMovementType | string;
  movementType?: InventoryMovementType | string;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  idempotencyKey?: string;
}

export interface ITransferStockInput {
  productId: string;
  variantId?: string | null;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason?: string;
  idempotencyKey?: string;
}

export interface IReserveStockInput {
  productId: string;
  variantId?: string | null;
  warehouseId: string;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  ttlSeconds?: number;
  idempotencyKey?: string;
}

export class InventoryService {
  static async getLowStockThreshold(tenantId: string, productId: string, variantId?: string | null): Promise<number> {
    if (variantId) {
      const variant = await ProductVariantModel.findOne({ _id: variantId, productId, tenantId });
      if (variant) return variant.lowStockThreshold;
    }
    const product = await ProductModel.findOne({ _id: productId, tenantId });
    return product ? product.lowStockThreshold : 10;
  }

  static async adjustStock(tenantId: string, input: IAdjustStockInput, actorUserId?: string): Promise<{ inventory: IInventoryDocument; movement: IInventoryMovementDocument }> {
    const { productId, warehouseId, quantityDelta, idempotencyKey } = input;
    const variantId = input.variantId || undefined;
    const movementType = (input.type || input.movementType || (quantityDelta >= 0 ? InventoryMovementType.STOCK_RECEIVED : InventoryMovementType.STOCK_ADJUSTED)) as InventoryMovementType;

    if (quantityDelta === 0) {
      throw new AppError('Quantity delta cannot be zero', 400, 'INVALID_QUANTITY');
    }

    if (idempotencyKey) {
      const existingMovement = await InventoryMovementModel.findOne({ tenantId, idempotencyKey });
      if (existingMovement) {
        const inv = await InventoryModel.findOne({ tenantId, productId, variantId: variantId || null, warehouseId });
        if (inv) {
          return { inventory: inv, movement: existingMovement };
        }
      }
    }

    const [product, location] = await Promise.all([
      ProductModel.findOne({ _id: productId, tenantId, isArchived: false }),
      WarehouseModel.findOne({ _id: warehouseId, tenantId, isArchived: false, isActive: true })
    ]);

    if (!product) {
      throw new AppError('Product not found in this tenant', 404, 'PRODUCT_NOT_FOUND');
    }
    if (!location) {
      throw new AppError('Warehouse not found or inactive in this tenant', 404, 'WAREHOUSE_NOT_FOUND');
    }

    if (variantId) {
      const variant = await ProductVariantModel.findOne({ _id: variantId, productId, tenantId, isArchived: false });
      if (!variant) {
        throw new AppError('Variant not found in this tenant', 404, 'VARIANT_NOT_FOUND');
      }
    }

    let inventory = await InventoryModel.findOne({ tenantId, productId, variantId: variantId || null, warehouseId });

    if (!inventory) {
      if (quantityDelta < 0) {
        throw new AppError('Insufficient stock available for adjustment (Available: 0)', 400, 'INSUFFICIENT_STOCK');
      }
      inventory = new InventoryModel({
        tenantId,
        productId,
        variantId: variantId || null,
        warehouseId,
        quantityOnHand: 0,
        quantityReserved: 0,
        quantityAvailable: 0,
        reorderPoint: product.lowStockThreshold,
        reorderQuantity: 50
      });
    }

    const quantityBefore = inventory.quantityOnHand;
    const newQuantityOnHand = quantityBefore + quantityDelta;

    if (newQuantityOnHand < inventory.quantityReserved) {
      throw new AppError(`Insufficient available stock. Reserved stock is ${inventory.quantityReserved}, cannot reduce below reserved.`, 400, 'INSUFFICIENT_STOCK');
    }

    const filter: Record<string, unknown> = {
      tenantId,
      productId,
      variantId: variantId || null,
      warehouseId
    };

    if (quantityDelta < 0) {
      filter.quantityAvailable = { $gte: Math.abs(quantityDelta) };
    }

    const updatedInv = await InventoryModel.findOneAndUpdate(
      filter,
      {
        $inc: { quantityOnHand: quantityDelta, quantityAvailable: quantityDelta },
        $setOnInsert: { tenantId, productId, variantId: variantId || null, warehouseId, quantityReserved: 0, reorderPoint: product.lowStockThreshold, reorderQuantity: 50 }
      },
      { new: true, upsert: quantityDelta > 0 }
    );

    if (!updatedInv) {
      throw new AppError('Stock adjustment failed due to insufficient available stock or concurrency update conflict', 400, 'INSUFFICIENT_STOCK');
    }

    const movement = await InventoryMovementModel.create({
      tenantId,
      productId,
      variantId: variantId || null,
      warehouseId,
      movementType,
      quantityDelta,
      quantityBefore,
      quantityAfter: updatedInv.quantityOnHand,
      referenceType: input.referenceType || 'MANUAL_ADJUSTMENT',
      referenceId: input.referenceId,
      reason: input.reason,
      actorUserId,
      idempotencyKey
    });

    const lowStockThreshold = await this.getLowStockThreshold(tenantId, productId, variantId);
    if (updatedInv.quantityAvailable <= 0) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId: actorUserId || 'SYSTEM',
        action: SystemEvents.OUT_OF_STOCK_DETECTED,
        resourceType: 'INVENTORY',
        resourceId: updatedInv._id.toString(),
        metadata: { productId, variantId, warehouseId, quantityAvailable: updatedInv.quantityAvailable }
      });
    } else if (updatedInv.quantityAvailable <= lowStockThreshold) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId: actorUserId || 'SYSTEM',
        action: SystemEvents.LOW_STOCK_DETECTED,
        resourceType: 'INVENTORY',
        resourceId: updatedInv._id.toString(),
        metadata: { productId, variantId, warehouseId, quantityAvailable: updatedInv.quantityAvailable, threshold: lowStockThreshold }
      });
    }

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.STOCK_ADJUSTED,
        resourceType: 'INVENTORY',
        resourceId: updatedInv._id.toString(),
        metadata: { productId, variantId, warehouseId, delta: quantityDelta, newTotal: updatedInv.quantityOnHand }
      });
    }

    return { inventory: updatedInv, movement };
  }

  static async transferStock(tenantId: string, input: ITransferStockInput, actorUserId?: string): Promise<{ fromInventory: IInventoryDocument; toInventory: IInventoryDocument }> {
    const { productId, fromWarehouseId, toWarehouseId, quantity, idempotencyKey } = input;
    const variantId = input.variantId || undefined;

    if (quantity <= 0) {
      throw new AppError('Transfer quantity must be greater than zero', 400, 'INVALID_QUANTITY');
    }

    if (fromWarehouseId === toWarehouseId) {
      throw new AppError('Source and destination warehouses must be different', 400, 'INVALID_TRANSFER_WAREHOUSES');
    }

    if (idempotencyKey) {
      const existingMovement = await InventoryMovementModel.findOne({ tenantId, idempotencyKey });
      if (existingMovement) {
        const fromInv = await InventoryModel.findOne({ tenantId, productId, variantId: variantId || null, warehouseId: fromWarehouseId });
        const toInv = await InventoryModel.findOne({ tenantId, productId, variantId: variantId || null, warehouseId: toWarehouseId });
        if (fromInv && toInv) {
          return { fromInventory: fromInv, toInventory: toInv };
        }
      }
    }

    const [fromLoc, toLoc] = await Promise.all([
      WarehouseModel.findOne({ _id: fromWarehouseId, tenantId, isArchived: false, isActive: true }),
      WarehouseModel.findOne({ _id: toWarehouseId, tenantId, isArchived: false, isActive: true })
    ]);

    if (!fromLoc) throw new AppError('Source warehouse not found or inactive', 404, 'SOURCE_WAREHOUSE_NOT_FOUND');
    if (!toLoc) throw new AppError('Destination warehouse not found or inactive', 404, 'DESTINATION_WAREHOUSE_NOT_FOUND');

    const sourceResult = await this.adjustStock(tenantId, {
      productId,
      variantId,
      warehouseId: fromWarehouseId,
      quantityDelta: -quantity,
      movementType: InventoryMovementType.STOCK_TRANSFERRED_OUT,
      referenceType: 'TRANSFER',
      reason: input.reason || `Transfer to ${toLoc.name} (${toLoc.code})`,
      idempotencyKey: idempotencyKey ? `${idempotencyKey}-OUT` : undefined
    }, actorUserId);

    const destResult = await this.adjustStock(tenantId, {
      productId,
      variantId,
      warehouseId: toWarehouseId,
      quantityDelta: quantity,
      movementType: InventoryMovementType.STOCK_TRANSFERRED_IN,
      referenceType: 'TRANSFER',
      reason: input.reason || `Transfer from ${fromLoc.name} (${fromLoc.code})`,
      idempotencyKey: idempotencyKey ? `${idempotencyKey}-IN` : undefined
    }, actorUserId);

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.STOCK_TRANSFERRED,
        resourceType: 'INVENTORY',
        resourceId: productId,
        metadata: { fromWarehouseId, toWarehouseId, quantity, productId, variantId }
      });
    }

    return { fromInventory: sourceResult.inventory, toInventory: destResult.inventory };
  }

  static async reserveStock(tenantId: string, input: IReserveStockInput, actorUserId?: string): Promise<{ reservation: IInventoryReservationDocument; inventory: IInventoryDocument }> {
    const { productId, warehouseId, quantity, idempotencyKey } = input;
    const variantId = input.variantId || undefined;

    if (quantity <= 0) {
      throw new AppError('Reservation quantity must be greater than 0', 400, 'INVALID_QUANTITY');
    }

    if (idempotencyKey) {
      const existingRes = await InventoryReservationModel.findOne({ tenantId, idempotencyKey });
      if (existingRes) {
        const inv = await InventoryModel.findOne({ tenantId, productId, variantId: variantId || null, warehouseId });
        if (inv) return { reservation: existingRes, inventory: inv };
      }
    }

    const updatedInv = await InventoryModel.findOneAndUpdate(
      {
        tenantId,
        productId,
        variantId: variantId || null,
        warehouseId,
        quantityAvailable: { $gte: quantity }
      },
      {
        $inc: { quantityReserved: quantity, quantityAvailable: -quantity }
      },
      { new: true }
    );

    if (!updatedInv) {
      throw new AppError('Insufficient available stock to reserve', 400, 'INSUFFICIENT_STOCK');
    }

    const ttl = input.ttlSeconds || 900;
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const reservation = await InventoryReservationModel.create({
      tenantId,
      productId,
      variantId: variantId || null,
      warehouseId,
      quantity,
      status: ReservationStatus.ACTIVE,
      referenceType: input.referenceType || 'CART',
      referenceId: input.referenceId,
      expiresAt,
      actorUserId,
      idempotencyKey
    });

    await InventoryMovementModel.create({
      tenantId,
      productId,
      variantId: variantId || null,
      warehouseId,
      movementType: InventoryMovementType.STOCK_RESERVED,
      quantityDelta: 0,
      quantityBefore: updatedInv.quantityOnHand,
      quantityAfter: updatedInv.quantityOnHand,
      referenceType: input.referenceType || 'RESERVATION',
      referenceId: reservation._id.toString(),
      reason: `Stock reserved (${quantity} units)`,
      actorUserId,
      idempotencyKey
    });

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.STOCK_RESERVED,
        resourceType: 'INVENTORY_RESERVATION',
        resourceId: reservation._id.toString(),
        metadata: { quantity, expiresAt }
      });
    }

    return { reservation, inventory: updatedInv };
  }

  static async releaseReservation(tenantId: string, reservationId: string, actorUserId?: string): Promise<{ reservation: IInventoryReservationDocument; inventory: IInventoryDocument }> {
    const reservation = await InventoryReservationModel.findOne({ _id: reservationId, tenantId, status: ReservationStatus.ACTIVE });
    if (!reservation) {
      throw new AppError('Active reservation not found', 404, 'RESERVATION_NOT_FOUND');
    }

    const updatedInv = await InventoryModel.findOneAndUpdate(
      {
        tenantId,
        productId: reservation.productId,
        variantId: reservation.variantId || null,
        warehouseId: reservation.warehouseId,
        quantityReserved: { $gte: reservation.quantity }
      },
      {
        $inc: { quantityReserved: -reservation.quantity, quantityAvailable: reservation.quantity }
      },
      { new: true }
    );

    if (!updatedInv) {
      throw new AppError('Failed to release reservation due to stock state mismatch', 400, 'RESERVATION_RELEASE_FAILED');
    }

    reservation.status = ReservationStatus.RELEASED;
    await reservation.save();

    await InventoryMovementModel.create({
      tenantId,
      productId: reservation.productId,
      variantId: reservation.variantId || null,
      warehouseId: reservation.warehouseId,
      movementType: InventoryMovementType.STOCK_RELEASED,
      quantityDelta: 0,
      quantityBefore: updatedInv.quantityOnHand,
      quantityAfter: updatedInv.quantityOnHand,
      referenceType: 'RESERVATION_RELEASE',
      referenceId: reservation._id.toString(),
      reason: `Released reservation of ${reservation.quantity} units`,
      actorUserId
    });

    if (actorUserId) {
      await SecurityService.logSecurityEvent({
        tenantId,
        actorUserId,
        action: SystemEvents.STOCK_RELEASED,
        resourceType: 'INVENTORY_RESERVATION',
        resourceId: reservation._id.toString(),
        metadata: { quantity: reservation.quantity }
      });
    }

    return { reservation, inventory: updatedInv };
  }

  static async consumeReservation(tenantId: string, reservationId: string, actorUserId?: string): Promise<{ reservation: IInventoryReservationDocument; inventory: IInventoryDocument }> {
    const reservation = await InventoryReservationModel.findOne({ _id: reservationId, tenantId, status: ReservationStatus.ACTIVE });
    if (!reservation) {
      throw new AppError('Active reservation not found', 404, 'RESERVATION_NOT_FOUND');
    }

    const updatedInv = await InventoryModel.findOneAndUpdate(
      {
        tenantId,
        productId: reservation.productId,
        variantId: reservation.variantId || null,
        warehouseId: reservation.warehouseId,
        quantityReserved: { $gte: reservation.quantity },
        quantityOnHand: { $gte: reservation.quantity }
      },
      {
        $inc: { quantityReserved: -reservation.quantity, quantityOnHand: -reservation.quantity }
      },
      { new: true }
    );

    if (!updatedInv) {
      throw new AppError('Failed to consume reservation due to insufficient reserved stock', 400, 'RESERVATION_CONSUME_FAILED');
    }

    reservation.status = ReservationStatus.CONSUMED;
    await reservation.save();

    await InventoryMovementModel.create({
      tenantId,
      productId: reservation.productId,
      variantId: reservation.variantId || null,
      warehouseId: reservation.warehouseId,
      movementType: InventoryMovementType.STOCK_SOLD,
      quantityDelta: -reservation.quantity,
      quantityBefore: updatedInv.quantityOnHand + reservation.quantity,
      quantityAfter: updatedInv.quantityOnHand,
      referenceType: 'ORDER',
      referenceId: reservation.referenceId || reservation._id.toString(),
      reason: `Consumed reservation for sale (${reservation.quantity} units)`,
      actorUserId
    });

    return { reservation, inventory: updatedInv };
  }

  static async getInventoryByLocation(tenantId: string, warehouseId: string) {
    const items = await InventoryModel.find({ tenantId, warehouseId });
    return items;
  }

  static async getInventoryMovements(tenantId: string, filters: { productId?: string; warehouseId?: string; page?: number; limit?: number }) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { tenantId };
    if (filters.productId) query.productId = filters.productId;
    if (filters.warehouseId) query.warehouseId = filters.warehouseId;

    const [items, total] = await Promise.all([
      InventoryMovementModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      InventoryMovementModel.countDocuments(query)
    ]);

    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  static async getLowStockAlerts(tenantId: string) {
    const inventories = await InventoryModel.find({ tenantId });
    const alerts = [];

    for (const inv of inventories) {
      const threshold = await this.getLowStockThreshold(tenantId, inv.productId, inv.variantId);
      if (inv.quantityAvailable <= threshold) {
        alerts.push({
          inventory: inv,
          threshold,
          status: inv.quantityAvailable <= 0 ? StockStatus.OUT_OF_STOCK : StockStatus.LOW_STOCK
        });
      }
    }

    return alerts;
  }
}
