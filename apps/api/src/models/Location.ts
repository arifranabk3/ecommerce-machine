import mongoose, { Document, Schema } from 'mongoose';
import { LocationType } from '@sellzy/shared';

export interface ILocationDocument extends Document {
  tenantId: string;
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

const locationSchema = new Schema<ILocationDocument>({
  tenantId: { type: String, required: true, index: true },
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

locationSchema.index({ tenantId: 1, normalizedCode: 1 }, { unique: true });
locationSchema.index({ tenantId: 1, isDefault: 1 });

export const LocationModel = mongoose.model<ILocationDocument>('Location', locationSchema);
