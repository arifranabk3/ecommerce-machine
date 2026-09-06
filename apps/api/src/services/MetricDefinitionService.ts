import { IMetricDefinition } from '@sellzy/shared';

export class MetricDefinitionService {
  private static definitions: Map<string, IMetricDefinition> = new Map([
    [
      'gross_sales',
      {
        metricName: 'gross_sales',
        description: 'Total revenue before discounts, taxes, or shipping',
        sourceCollection: 'orders',
        calculationType: 'SUM',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.sales.view'
      }
    ],
    [
      'net_sales',
      {
        metricName: 'net_sales',
        description: 'Gross sales minus discounts and refunds plus shipping & taxes',
        sourceCollection: 'orders',
        calculationType: 'DERIVED',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.sales.view'
      }
    ],
    [
      'gross_profit',
      {
        metricName: 'gross_profit',
        description: 'Net sales minus vendor costs / COGS',
        sourceCollection: 'orders',
        calculationType: 'DERIVED',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.profit.view'
      }
    ],
    [
      'contribution_profit',
      {
        metricName: 'contribution_profit',
        description: 'Gross profit minus shipping costs, RTO costs, and marketing spend',
        sourceCollection: 'orders',
        calculationType: 'DERIVED',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.profit.view'
      }
    ],
    [
      'aov',
      {
        metricName: 'aov',
        description: 'Average Order Value (Net Sales / Total Orders)',
        sourceCollection: 'orders',
        calculationType: 'RATIO',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.orders.view'
      }
    ],
    [
      'rto_rate',
      {
        metricName: 'rto_rate',
        description: 'Percentage of orders returned to origin',
        sourceCollection: 'returntoorigins',
        calculationType: 'RATIO',
        isMinorUnit: false,
        currencyAware: false,
        permissionRequired: 'analytics.shipping.view'
      }
    ],
    [
      'repeat_purchase_rate',
      {
        metricName: 'repeat_purchase_rate',
        description: 'Percentage of customers with > 1 order',
        sourceCollection: 'customers',
        calculationType: 'DERIVED',
        isMinorUnit: false,
        currencyAware: false,
        permissionRequired: 'analytics.customers.view'
      }
    ],
    [
      'ltv',
      {
        metricName: 'ltv',
        description: 'Customer Lifetime Value',
        sourceCollection: 'customers',
        calculationType: 'AVERAGE',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.customers.view'
      }
    ],
    [
      'outstanding_payable',
      {
        metricName: 'outstanding_payable',
        description: 'Total unpaid vendor invoices',
        sourceCollection: 'vendor_ledgers',
        calculationType: 'DERIVED',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.vendors.view'
      }
    ],
    [
      'total_orders',
      {
        metricName: 'total_orders',
        description: 'Total non-cancelled orders',
        sourceCollection: 'orders',
        calculationType: 'COUNT',
        isMinorUnit: false,
        currencyAware: false,
        permissionRequired: 'analytics.orders.view'
      }
    ],
    [
      'automation_success_rate',
      {
        metricName: 'automation_success_rate',
        description: 'Percentage of successful workflow runs',
        sourceCollection: 'automationruns',
        calculationType: 'RATIO',
        isMinorUnit: false,
        currencyAware: false,
        permissionRequired: 'analytics.automation.view'
      }
    ],
    [
      'inventory_value',
      {
        metricName: 'inventory_value',
        description: 'Total value of on-hand inventory',
        sourceCollection: 'inventory',
        calculationType: 'SUM',
        isMinorUnit: true,
        currencyAware: true,
        permissionRequired: 'analytics.products.view'
      }
    ]
  ]);

  static getDefinition(metricName: string): IMetricDefinition | undefined {
    return this.definitions.get(metricName);
  }

  static getAll(): IMetricDefinition[] {
    return Array.from(this.definitions.values());
  }
}
