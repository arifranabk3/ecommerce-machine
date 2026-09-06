import mongoose, { Schema, Document } from 'mongoose';
import { AutomationExceptionSeverity, AutomationExceptionStatus, IAutomationException } from '@sellzy/shared';

export interface IAutomationExceptionDocument extends Omit<IAutomationException, 'id'>, Document {}

const AutomationExceptionSchema = new Schema<IAutomationExceptionDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    workflowRunId: { type: String, index: true },
    severity: { type: String, enum: Object.values(AutomationExceptionSeverity), default: AutomationExceptionSeverity.MEDIUM, index: true },
    category: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    resourceType: { type: String },
    resourceId: { type: String },
    recommendedAction: { type: String },
    status: { type: String, enum: Object.values(AutomationExceptionStatus), default: AutomationExceptionStatus.OPEN, index: true },
    assignedTo: { type: String },
    resolvedBy: { type: String },
    resolvedAt: { type: Date },
    resolution: { type: String }
  },
  { timestamps: true }
);

AutomationExceptionSchema.index({ tenantId: 1, status: 1, severity: 1 });

export const AutomationExceptionModel = mongoose.model<IAutomationExceptionDocument>('AutomationException', AutomationExceptionSchema);
