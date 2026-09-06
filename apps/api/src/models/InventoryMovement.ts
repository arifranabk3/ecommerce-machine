import mongoose, { Document, Schema } from 'mongoose';
import { InventoryMovementType } from '@sellzy/shared';

export interface IInventoryMovementDocument extends Document {
  tenantId: string;
  productId: string;
  variantId?: string;
  locationId: string;
  movementType: InventoryMovementType;
  quantityDelta: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  actorUserId?: string;
  idempotencyKey?: string;
  createdAt: Date;
}

const inventoryMovementSchema = new Schema<IInventoryMovementDocument>({
  tenantId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  variantId: { type: String, index: true, default: null },
  locationId: { type: String, required: true, index: true },
  movementType: { 
    type: String, 
    enum: Object.values(InventoryMovementType), 
    required: true 
  },
  quantityDelta: { type: Number, required: true },
  quantityBefore: { type: Number, required: true },
  quantityAfter: { type: Number, required: true },
  referenceType: { type: String },
  referenceId: { type: String },
  reason: { type: String },
  actorUserId: { type: String },
  idempotencyKey: { type: String, index: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

inventoryMovementSchema.index({ tenantId: 1, idempotencyKey: 1 }, { sparse: true });
inventoryMovementSchema.index({ tenantId: 1, productId: 1, locationId: 1, createdAt: -1 });

export const InventoryMovementModel = mongoose.model<IInventoryMovementDocument>('InventoryMovement', inventoryMovementSchema);
