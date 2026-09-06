import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryDocument extends Document {
  tenantId: string;
  name: string;
  normalizedName: string;
  slug: string;
  description?: string;
  parentId?: string;
  path: string[];
  depth: number;
  productCount: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  normalizedName: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  parentId: { type: String, index: true },
  path: [{ type: String }],
  depth: { type: Number, default: 0 },
  productCount: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date }
}, {
  timestamps: true
});

categorySchema.index({ tenantId: 1, normalizedName: 1 }, { unique: true });
categorySchema.index({ tenantId: 1, slug: 1 }, { unique: true });
categorySchema.index({ tenantId: 1, isArchived: 1, parentId: 1 });

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', categorySchema);
