import mongoose, { Document, Schema } from 'mongoose';

export interface ITenantMembershipDocument extends Document {
  tenantId: string;
  userId: string;
  roles: string[];
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED';
  isOwner: boolean;
  joinedAt: Date;
  invitedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tenantMembershipSchema = new Schema<ITenantMembershipDocument>({
  tenantId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  roles: [{ type: String, required: true }],
  status: { 
    type: String, 
    enum: ['INVITED', 'ACTIVE', 'SUSPENDED', 'REMOVED'], 
    default: 'ACTIVE',
    index: true 
  },
  isOwner: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  invitedBy: { type: String }
}, {
  timestamps: true
});

tenantMembershipSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
tenantMembershipSchema.index({ userId: 1, status: 1 });

export const TenantMembershipModel = mongoose.model<ITenantMembershipDocument>('TenantMembership', tenantMembershipSchema);
