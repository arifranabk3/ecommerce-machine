import { RiskLevel } from '@sellzy/shared';

export interface IActionMetadata {
  type: string;
  description: string;
  riskLevel: RiskLevel;
  requiredPermission: string;
  reversible: boolean;
  requiresApproval: boolean;
  isFinancialHighRisk?: boolean;
  handler: (tenantId: string, params: Record<string, any>, context?: Record<string, any>) => Promise<any>;
}

export class ActionRegistry {
  private static actions: Map<string, IActionMetadata> = new Map();

  public static register(metadata: IActionMetadata): void {
    this.actions.set(metadata.type, metadata);
  }

  public static get(type: string): IActionMetadata | undefined {
    return this.actions.get(type);
  }

  public static getAll(): IActionMetadata[] {
    return Array.from(this.actions.values());
  }

  public static isFinancialHighRisk(type: string): boolean {
    const highRiskFinancialTypes = [
      'VENDOR_PAYMENT',
      'REFUND',
      'LEDGER_ADJUSTMENT',
      'SETTLEMENT_APPROVAL',
      'PAYMENT_CAPTURE',
      'PAYMENT_RELEASE'
    ];
    if (highRiskFinancialTypes.includes(type)) return true;
    const action = this.get(type);
    return action?.isFinancialHighRisk || false;
  }
}

// Register default actions
ActionRegistry.register({
  type: 'CREATE_PROCUREMENT',
  description: 'Create automated procurement purchase order for low stock',
  riskLevel: RiskLevel.MEDIUM,
  requiredPermission: 'procurement.create',
  reversible: false,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, procurementId: `po_auto_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'HOLD_ORDER',
  description: 'Hold customer order for manual fraud or risk review',
  riskLevel: RiskLevel.MEDIUM,
  requiredPermission: 'orders.update',
  reversible: true,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, status: 'HELD', tenantId, ...params })
});

ActionRegistry.register({
  type: 'RELEASE_ORDER',
  description: 'Release held order for fulfillment',
  riskLevel: RiskLevel.LOW,
  requiredPermission: 'orders.update',
  reversible: true,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, status: 'RELEASED', tenantId, ...params })
});

ActionRegistry.register({
  type: 'SEND_NOTIFICATION',
  description: 'Send internal system notification to user',
  riskLevel: RiskLevel.LOW,
  requiredPermission: 'notifications.create',
  reversible: false,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, notificationId: `notif_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'SEND_WHATSAPP',
  description: 'Send WhatsApp notification',
  riskLevel: RiskLevel.LOW,
  requiredPermission: 'messages.send',
  reversible: false,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, messageId: `wa_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'SEND_EMAIL',
  description: 'Send Email notification',
  riskLevel: RiskLevel.LOW,
  requiredPermission: 'messages.send',
  reversible: false,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, messageId: `email_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'SEND_SMS',
  description: 'Send SMS notification',
  riskLevel: RiskLevel.LOW,
  requiredPermission: 'messages.send',
  reversible: false,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, messageId: `sms_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'CREATE_EXCEPTION',
  description: 'Create automation exception item in inbox',
  riskLevel: RiskLevel.LOW,
  requiredPermission: 'automation.exceptions.manage',
  reversible: false,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ success: true, exceptionId: `exc_${Date.now()}`, tenantId, ...params })
});

// Financial High-Risk Actions
ActionRegistry.register({
  type: 'VENDOR_PAYMENT',
  description: 'Execute vendor settlement payout',
  riskLevel: RiskLevel.HIGH,
  requiredPermission: 'vendors.payments.create',
  reversible: false,
  requiresApproval: true,
  isFinancialHighRisk: true,
  handler: async (tenantId, params) => ({ success: true, paymentId: `vpay_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'REFUND',
  description: 'Issue customer refund',
  riskLevel: RiskLevel.HIGH,
  requiredPermission: 'payments.refund',
  reversible: false,
  requiresApproval: true,
  isFinancialHighRisk: true,
  handler: async (tenantId, params) => ({ success: true, refundId: `ref_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'LEDGER_ADJUSTMENT',
  description: 'Post manual ledger entry adjustment',
  riskLevel: RiskLevel.CRITICAL,
  requiredPermission: 'finance.ledger.manage',
  reversible: false,
  requiresApproval: true,
  isFinancialHighRisk: true,
  handler: async (tenantId, params) => ({ success: true, entryId: `ledg_${Date.now()}`, tenantId, ...params })
});

ActionRegistry.register({
  type: 'SETTLEMENT_APPROVAL',
  description: 'Approve vendor settlement batch',
  riskLevel: RiskLevel.HIGH,
  requiredPermission: 'vendors.settlement.approve',
  reversible: false,
  requiresApproval: true,
  isFinancialHighRisk: true,
  handler: async (tenantId, params) => ({ success: true, settlementId: `sett_${Date.now()}`, tenantId, ...params })
});
