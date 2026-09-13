import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryDocument extends Document {
  tenantId: string;
  storeId: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  binLocation?: string;
  reorderPoint: number;
  reorderQuantity: number;
  lastStockTakeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventoryDocument>({
  tenantId: { type: String, required: true, index: true },
  storeId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  variantId: { type: String, index: true, default: null },
  warehouseId: { type: String, required: true, index: true },
  quantityOnHand: { type: Number, default: 0, min: 0 },
  quantityReserved: { type: Number, default: 0, min: 0 },
  quantityAvailable: { type: Number, default: 0, min: 0 },
  binLocation: { type: String },
  reorderPoint: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 50 },
  lastStockTakeAt: { type: Date }
}, {
  timestamps: true
});

inventorySchema.index({ tenantId: 1, storeId: 1, productId: 1, variantId: 1, warehouseId: 1 }, { unique: true });
inventorySchema.index({ tenantId: 1, storeId: 1, warehouseId: 1 });
inventorySchema.index({ tenantId: 1, storeId: 1, quantityAvailable: 1 });

export const InventoryModel = mongoose.model<IInventoryDocument>('Inventory', inventorySchema);
