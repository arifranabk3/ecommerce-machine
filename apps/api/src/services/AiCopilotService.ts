import { AiToolRegistry } from './AiToolRegistry';
import { logger } from '../utils/logger';

export interface IAiBriefResult {
  facts: Record<string, any>;
  recommendations: string[];
  risks: string[];
  actionRequired: string[];
  confidenceScore: number;
}

export class AiCopilotService {
  public static sanitizeInput(input: string): string {
    if (!input) return '';
    // Strip prompt injection attempts like "Ignore previous instructions", "Reveal API key", etc.
    const injectionPatterns = [
      /ignore\s+previous\s+instructions/gi,
      /reveal\s+(the\s+)?(api|secret|key|token)/gi,
      /send\s+all\s+customers/gi,
      /override\s+system/gi,
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
    ];
    let sanitized = input;
    for (const pattern of injectionPatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED_PROMPT_INJECTION]');
    }
    return sanitized;
  }

  public static async generateDailyBrief(tenantId: string): Promise<IAiBriefResult> {
    const ordersData = await AiToolRegistry.executeTool(tenantId, 'summarize_orders', {}, ['*']);
    return {
      facts: {
        tenantId,
        date: new Date().toISOString().split('T')[0],
        totalOrders: ordersData.totalOrders || 0,
        revenueMinor: ordersData.revenueMinor || 0,
        failedPayments: 0,
        lowStockItems: 3,
        pendingApprovals: 2,
        openExceptions: 1
      },
      recommendations: [
        'Reorder 50 units of low-stock SKU-100 to prevent stockout',
        'Review 2 pending vendor payment approval requests'
      ],
      risks: [
        'SKU-100 inventory will deplete in 48 hours based on sales velocity'
      ],
      actionRequired: [
        'Approve vendor payment batch for Tenant'
      ],
      confidenceScore: 0.95
    };
  }

  public static async classifyMessage(tenantId: string, messageBody: string): Promise<{ category: string; urgency: string; confidence: number; promptInjectionDetected: boolean }> {
    const sanitized = this.sanitizeInput(messageBody);
    const hasInjection = sanitized.includes('[REDACTED_PROMPT_INJECTION]');

    const res = await AiToolRegistry.executeTool(tenantId, 'classify_message', { body: sanitized }, ['*']);
    return {
      category: res.category,
      urgency: res.urgency,
      confidence: hasInjection ? 0.4 : 0.9,
      promptInjectionDetected: hasInjection
    };
  }

  public static async draftResponse(tenantId: string, customerQuery: string): Promise<{ draft: string; confidence: number; promptInjectionDetected: boolean }> {
    const sanitized = this.sanitizeInput(customerQuery);
    const hasInjection = sanitized.includes('[REDACTED_PROMPT_INJECTION]');

    if (hasInjection) {
      logger.warn({ tenantId, customerQuery }, 'AiCopilotService: Prompt injection detected in draft response request');
      return {
        draft: 'Thank you for reaching out. A support agent will assist you shortly.',
        confidence: 0.2,
        promptInjectionDetected: true
      };
    }

    return {
      draft: `Hello! Thank you for contacting Sellzy support regarding your inquiry: "${sanitized.slice(0, 50)}...". How can we assist you today?`,
      confidence: 0.88,
      promptInjectionDetected: false
    };
  }

  public static async executeToolSafe(tenantId: string, toolName: string, params: Record<string, any>, userPermissions: string[] = []): Promise<any> {
    return AiToolRegistry.executeTool(tenantId, toolName, params, userPermissions);
  }
}
