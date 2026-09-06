import mongoose, { Schema, Document } from 'mongoose';
import { AutomationWorkflowStatus, AutomationMode, IAutomationWorkflow, IAutomationRule, IAutomationActionConfig } from '@sellzy/shared';

export interface IAutomationWorkflowDocument extends Omit<IAutomationWorkflow, 'id'>, Document {}

const RuleSchema = new Schema<IAutomationRule>({
  field: { type: String, required: true },
  operator: {
    type: String,
    enum: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'in', 'notIn', 'contains', 'exists', 'between'],
    required: true
  },
  value: { type: Schema.Types.Mixed },
  logic: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  not: { type: Boolean, default: false }
}, { _id: false });
RuleSchema.add({ rules: [RuleSchema] });

const ActionConfigSchema = new Schema<IAutomationActionConfig>({
  actionType: { type: String, required: true },
  params: { type: Schema.Types.Mixed, default: {} },
  mode: { type: String, enum: Object.values(AutomationMode), default: AutomationMode.AUTO }
}, { _id: false });

const AutomationWorkflowSchema = new Schema<IAutomationWorkflowDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(AutomationWorkflowStatus), default: AutomationWorkflowStatus.DRAFT, index: true },
    trigger: { type: String, required: true, index: true },
    conditions: { type: [RuleSchema], default: [] },
    actions: { type: [ActionConfigSchema], default: [] },
    mode: { type: String, enum: Object.values(AutomationMode), default: AutomationMode.AUTO },
    priority: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true, index: true },
    maxExecutions: { type: Number },
    rateLimit: { type: Number },
    cooldownSeconds: { type: Number, default: 0 },
    effectiveFrom: { type: Date },
    effectiveUntil: { type: Date },
    createdBy: { type: String, required: true },
    updatedBy: { type: String },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

AutomationWorkflowSchema.index({ tenantId: 1, trigger: 1, enabled: 1 });
AutomationWorkflowSchema.index({ tenantId: 1, status: 1 });

export const AutomationWorkflowModel = mongoose.model<IAutomationWorkflowDocument>('AutomationWorkflow', AutomationWorkflowSchema);
