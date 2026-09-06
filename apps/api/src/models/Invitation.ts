import mongoose, { Document, Schema } from 'mongoose';

export interface IInvitationDocument extends Document {
  tenantId: string;
  email: string;
  role: string;
  tokenHash: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: Date;
  invitedBy: string;
  acceptedAt?: Date;
  createdAt: Date;
}

const invitationSchema = new Schema<IInvitationDocument>({
  tenantId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], 
    default: 'PENDING',
    index: true 
  },
  expiresAt: { type: Date, required: true, index: true },
  invitedBy: { type: String, required: true }
}, {
  timestamps: true
});

invitationSchema.index({ tenantId: 1, email: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const InvitationModel = mongoose.model<IInvitationDocument>('Invitation', invitationSchema);
