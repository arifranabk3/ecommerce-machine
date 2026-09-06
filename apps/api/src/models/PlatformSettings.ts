import mongoose, { Schema, Document } from 'mongoose';
import { IPlatformSettings } from '@sellzy/shared';

export interface IPlatformSettingsDocument extends Document, IPlatformSettings {}

const PlatformSettingsSchema = new Schema<IPlatformSettingsDocument>(
  {
    defaultCurrency: { type: String, default: 'USD' },
    defaultTimezone: { type: String, default: 'UTC' },
    rateLimitPerMinute: { type: Number, default: 200 },
    webhookMaxRetries: { type: Number, default: 5 },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'System undergoing scheduled maintenance' },
    allowedRolesInMaintenance: [{ type: String, default: ['SuperAdmin', 'Owner'] }]
  },
  { timestamps: true }
);

export const PlatformSettingsModel =
  mongoose.models.PlatformSettings || mongoose.model<IPlatformSettingsDocument>('PlatformSettings', PlatformSettingsSchema);
