import mongoose, { Document, Schema } from 'mongoose';
import { LocationType } from '@sellzy/shared';

export interface IWarehouseDocument extends Document {
  tenantId: string;
  storeId: string;
  name: string;
  code: string;
  normalizedCode: string;
  type: LocationType;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isDefault: boolean;
  isActive: boolean;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouseDocument>({
  tenantId: { type: String, required: true, index: true },
  storeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  normalizedCode: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(LocationType), 
    default: LocationType.WAREHOUSE 
  },
  address: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date }
}, {
  timestamps: true
});

warehouseSchema.index({ tenantId: 1, storeId: 1, normalizedCode: 1 }, { unique: true });
warehouseSchema.index({ tenantId: 1, storeId: 1, isDefault: 1 });

export const WarehouseModel = mongoose.model<IWarehouseDocument>('Warehouse', warehouseSchema);
