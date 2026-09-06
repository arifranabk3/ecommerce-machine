import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordResetTokenDocument extends Document {
  tenantId: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetTokenDocument>({
  tenantId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  usedAt: { type: Date }
}, {
  timestamps: true
});

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetTokenModel = mongoose.model<IPasswordResetTokenDocument>('PasswordResetToken', passwordResetTokenSchema);
