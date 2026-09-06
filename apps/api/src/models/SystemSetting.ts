import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSettingDocument extends Document {
  tenantId: string;
  key: string;
  value: unknown;
  category: string;
  updatedAt: Date;
}

const systemSettingSchema = new Schema<ISystemSettingDocument>({
  tenantId: { type: String, required: true, index: true },
  key: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  category: { type: String, required: true, default: 'general' }
}, {
  timestamps: true
});

systemSettingSchema.index({ tenantId: 1, key: 1 }, { unique: true });

export const SystemSettingModel = mongoose.model<ISystemSettingDocument>('SystemSetting', systemSettingSchema);
