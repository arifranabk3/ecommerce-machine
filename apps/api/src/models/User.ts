import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDocument extends Document {
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'INACTIVE' | 'INVITED' | 'SUSPENDED' | 'LOCKED' | 'DISABLED';
  roles: string[];
  isOwner: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaRecoveryCodes: string[]; // Store hashed recovery codes
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  passwordHash: { type: String, required: true, select: false },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'PENDING_VERIFICATION', 'INACTIVE', 'INVITED', 'SUSPENDED', 'LOCKED', 'DISABLED'], 
    default: 'PENDING_VERIFICATION' 
  },
  roles: [{ type: String, required: true }],
  isOwner: { type: Boolean, default: false },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String, select: false },
  mfaRecoveryCodes: [{ type: String, select: false }],
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpires: { type: Date, select: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date },
  lastLoginAt: { type: Date },
  lastLoginIp: { type: String }
}, {
  timestamps: true
});

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ tenantId: 1, status: 1 });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
