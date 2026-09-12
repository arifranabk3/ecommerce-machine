import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreDocument extends Document {
  storeId: string;
  tenantId: string;
  name: string;
  slug: string;
  domain?: string;
  country: string;
  currency: string;
  locale: string;
  timezone: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISABLED';
  themeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStoreDocument>({
  storeId: { type: String, required: true, unique: true, index: true },
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  domain: { type: String, unique: true, sparse: true, index: true },
  country: { type: String, required: true, default: 'PK' },
  currency: { type: String, required: true, default: 'PKR' },
  locale: { type: String, required: true, default: 'en-PK' },
  timezone: { type: String, required: true, default: 'UTC' },
  status: { type: String, enum: ['ACTIVE', 'MAINTENANCE', 'DISABLED'], default: 'ACTIVE' },
  themeId: { type: String }
}, {
  timestamps: true
});

export const StoreModel = mongoose.model<IStoreDocument>('Store', storeSchema);
