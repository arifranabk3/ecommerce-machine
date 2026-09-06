import { RiskLevel } from '@sellzy/shared';

export interface IAiToolDefinition {
  name: string;
  description: string;
  permission: string;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  isFinancialHighRisk?: boolean;
  handler: (tenantId: string, params: Record<string, any>) => Promise<any>;
}

export class AiToolRegistry {
  private static tools: Map<string, IAiToolDefinition> = new Map();

  public static register(tool: IAiToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public static get(name: string): IAiToolDefinition | undefined {
    return this.tools.get(name);
  }

  public static getAll(): IAiToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public static async executeTool(tenantId: string, name: string, params: Record<string, any>, userPermissions: string[] = []): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`AI Tool '${name}' is not registered or supported`);
    }

    // High Risk / Financial action safety boundary check (Enforced before permission check)
    if (tool.requiresApproval || tool.isFinancialHighRisk) {
      throw new Error(`AI Tool '${name}' requires human approval and cannot be executed directly by AI`);
    }

    // Permission check
    if (tool.permission && !userPermissions.includes('*') && !userPermissions.includes(tool.permission)) {
      throw new Error(`Permission denied for AI Tool '${name}'. Requires '${tool.permission}'`);
    }

    return tool.handler(tenantId, params);
  }
}

// Register safe AI tools
AiToolRegistry.register({
  name: 'summarize_orders',
  description: 'Summarize order performance metrics for tenant',
  permission: 'orders.view',
  riskLevel: RiskLevel.LOW,
  requiresApproval: false,
  handler: async (tenantId, params) => ({ summary: `Orders summary for ${tenantId}`, totalOrders: 150, revenueMinor: 4500000, ...params })
});

AiToolRegistry.register({
  name: 'classify_message',
  description: 'Classify incoming customer message intent',
  permission: 'messages.view',
  riskLevel: RiskLevel.LOW,
  requiresApproval: false,
  handler: async (_tenantId, params) => {
    const body = String(params.body || '').toLowerCase();
    if (body.includes('refund') || body.includes('return')) return { category: 'RETURN_REQUEST', urgency: 'HIGH' };
    if (body.includes('order') || body.includes('track')) return { category: 'ORDER_STATUS', urgency: 'MEDIUM' };
    return { category: 'GENERAL_INQUIRY', urgency: 'LOW' };
  }
});

AiToolRegistry.register({
  name: 'recommend_stock_procurement',
  description: 'Recommend inventory reorder quantities based on sales velocity',
  permission: 'procurement.view',
  riskLevel: RiskLevel.LOW,
  requiresApproval: false,
  handler: async (_tenantId, params) => ({ recommendation: 'Reorder 50 units of SKU-100', recommendedQuantity: 50, ...params })
});

// Prohibited / High risk tool registration (for testing boundary defense)
AiToolRegistry.register({
  name: 'execute_vendor_payout',
  description: 'Execute vendor payment payout directly',
  permission: 'vendors.payments.create',
  riskLevel: RiskLevel.CRITICAL,
  requiresApproval: true,
  isFinancialHighRisk: true,
  handler: async () => { throw new Error('Forbidden: Financial actions cannot be executed directly by AI'); }
});
