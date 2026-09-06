import mongoose, { Document, Schema } from 'mongoose';
import { ReservationStatus } from '@sellzy/shared';

export interface IInventoryReservationDocument extends Document {
  tenantId: string;
  productId: string;
  variantId?: string;
  locationId: string;
  quantity: number;
  status: ReservationStatus;
  referenceType?: string;
  referenceId?: string;
  expiresAt: Date;
  actorUserId?: string;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryReservationSchema = new Schema<IInventoryReservationDocument>({
  tenantId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  variantId: { type: String, index: true, default: null },
  locationId: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: Object.values(ReservationStatus), 
    default: ReservationStatus.ACTIVE 
  },
  referenceType: { type: String },
  referenceId: { type: String },
  expiresAt: { type: Date, required: true },
  actorUserId: { type: String },
  idempotencyKey: { type: String, index: true }
}, {
  timestamps: true
});

inventoryReservationSchema.index({ tenantId: 1, status: 1, expiresAt: 1 });
inventoryReservationSchema.index({ tenantId: 1, idempotencyKey: 1 }, { sparse: true });
inventoryReservationSchema.index({ tenantId: 1, productId: 1, locationId: 1 });

export const InventoryReservationModel = mongoose.model<IInventoryReservationDocument>('InventoryReservation', inventoryReservationSchema);
