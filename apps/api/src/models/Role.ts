import mongoose, { Document, Schema } from 'mongoose';

export interface IRoleDocument extends Document {
  tenantId: string;
  name: string;
  normalizedName: string;
  description?: string;
  permissions: string[];
  systemRole: boolean;
  protected: boolean;
  createdBy?: string;
  updatedBy?: string;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRoleDocument>({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  normalizedName: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: String, required: true }],
  systemRole: { type: Boolean, default: false },
  protected: { type: Boolean, default: false },
  createdBy: { type: String },
  updatedBy: { type: String },
  archivedAt: { type: Date }
}, {
  timestamps: true
});

roleSchema.index({ tenantId: 1, normalizedName: 1 }, { unique: true });
roleSchema.index({ tenantId: 1, archivedAt: 1 });

export const RoleModel = mongoose.model<IRoleDocument>('Role', roleSchema);

