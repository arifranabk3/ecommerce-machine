import mongoose, { Schema, Document } from 'mongoose';
import { IApiKey } from '@sellzy/shared';

export interface IApiKeyDocument extends Document, Omit<IApiKey, 'id'> {}

const ApiKeySchema = new Schema<IApiKeyDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    keyPrefix: { type: String, required: true, index: true },
    keyHash: { type: String, required: true, unique: true },
    scopes: [{ type: String, required: true }],
    expiresAt: { type: Date },
    lastUsedAt: { type: Date },
    revokedAt: { type: Date, index: true }
  },
  { timestamps: true }
);

ApiKeySchema.index({ tenantId: 1, revokedAt: 1 });

export const ApiKeyModel = mongoose.models.ApiKey || mongoose.model<IApiKeyDocument>('ApiKey', ApiKeySchema);
