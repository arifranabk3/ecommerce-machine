import mongoose, { Schema, Document } from 'mongoose';
import { AutomationRunStatus, IAutomationRun } from '@sellzy/shared';

export interface IAutomationRunDocument extends Omit<IAutomationRun, 'id'>, Document {}

const AutomationRunSchema = new Schema<IAutomationRunDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    workflowId: { type: String, required: true, index: true },
    workflowVersion: { type: Number, required: true },
    triggerEventId: { type: String, required: true, index: true },
    status: { type: String, enum: Object.values(AutomationRunStatus), default: AutomationRunStatus.QUEUED, index: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    currentStep: { type: Number, default: 0 },
    decision: { type: Schema.Types.Mixed },
    actionResults: { type: [Schema.Types.Mixed], default: [] },
    error: { type: String },
    correlationId: { type: String, required: true }
  },
  { timestamps: true }
);

AutomationRunSchema.index({ tenantId: 1, workflowId: 1, triggerEventId: 1 }, { unique: true });
AutomationRunSchema.index({ tenantId: 1, status: 1 });

export const AutomationRunModel = mongoose.model<IAutomationRunDocument>('AutomationRun', AutomationRunSchema);
