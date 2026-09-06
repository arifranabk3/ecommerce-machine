import mongoose, { Document, Schema } from 'mongoose';

export interface ISessionDocument extends Document {
  sessionId: string;
  tenantId: string;
  userId: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  revokeReason?: string;
  createdAt: Date;
}

const sessionSchema = new Schema<ISessionDocument>({
  sessionId: { type: String, required: true, unique: true, index: true },
  tenantId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  token: { type: String, required: true, unique: true, index: true },
  userAgent: { type: String },
  ipAddress: { type: String },
  lastActivityAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true },
  revokedAt: { type: Date },
  revokeReason: { type: String }
}, {
  timestamps: true
});

sessionSchema.index({ tenantId: 1, userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatic MongoDB TTL cleanup

export const SessionModel = mongoose.model<ISessionDocument>('Session', sessionSchema);
