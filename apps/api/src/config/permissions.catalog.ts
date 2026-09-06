import { IPermissionDefinition, IPermissionGroup, PermissionRiskLevel, PermissionClassification } from '@sellzy/shared';

export const PERMISSIONS_CATALOG: IPermissionGroup[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Dashboard metric cards & executive overview access',
    permissions: [
      {
        key: 'dashboard.view',
        label: 'View Dashboard',
        description: 'Allows viewing main business dashboard & operational KPIs',
        group: 'Dashboard',
        riskLevel: PermissionRiskLevel.LOW,
        classification: PermissionClassification.READ
      }
    ]
  },
  {
    id: 'users',
    name: 'Users & Team Members',
    description: 'Tenant user accounts and team member management',
    permissions: [
      { key: 'users.view', label: 'View Users', description: 'View list of users, profiles, and active sessions', group: 'Users', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'users.invite', label: 'Invite Team Members', description: 'Send tenant team invitations to new users', group: 'Users', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION },
      { key: 'users.update', label: 'Update User Details', description: 'Modify user profiles or role assignments within permitted ceiling', group: 'Users', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'users.suspend', label: 'Suspend User Access', description: 'Temporarily block a user from accessing tenant resources', group: 'Users', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'users.remove', label: 'Remove User from Tenant', description: 'Permanently revoke tenant membership for a user', group: 'Users', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true }
    ]
  },
  {
    id: 'roles',
    name: 'Roles & Permissions',
    description: 'Custom roles definition and permission matrices',
    permissions: [
      { key: 'roles.view', label: 'View Roles', description: 'Inspect system and custom tenant roles', group: 'Roles', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'roles.create', label: 'Create Custom Roles', description: 'Define new custom roles within your permission ceiling', group: 'Roles', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'roles.update', label: 'Edit Custom Roles', description: 'Modify role names, descriptions, or assigned permissions', group: 'Roles', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'roles.archive', label: 'Archive Roles', description: 'Archive custom roles to prevent future assignments', group: 'Roles', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'roles.assign', label: 'Assign Roles to Users', description: 'Grant or revoke roles for tenant members', group: 'Roles', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true }
    ]
  },
  {
    id: 'products',
    name: 'Products & Catalog',
    description: 'Product catalog & item definition controls',
    permissions: [
      { key: 'products.view', label: 'View Products', description: 'Browse product catalog & variants', group: 'Products', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'products.create', label: 'Create Products', description: 'Add new items & variants to catalog', group: 'Products', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'products.update', label: 'Edit Products', description: 'Update product prices, info, & variants', group: 'Products', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'products.archive', label: 'Archive Products', description: 'Archive products & variants from active catalog', group: 'Products', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'products.delete', label: 'Delete Products', description: 'Legacy product deletion key', group: 'Products', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'categories.archive', label: 'Archive Categories', description: 'Archive product categories', group: 'Products', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock Control',
    description: 'Multi-location stock balances, movements, and reservations',
    permissions: [
      { key: 'inventory.view', label: 'View Inventory', description: 'View stock balances, movements, & alerts', group: 'Inventory', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'inventory.adjust', label: 'Adjust Stock', description: 'Perform manual inventory stock adjustments', group: 'Inventory', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'inventory.transfer', label: 'Transfer Stock', description: 'Transfer stock between locations', group: 'Inventory', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'inventory.reserve', label: 'Reserve Stock', description: 'Create or release inventory holds', group: 'Inventory', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'inventory.manage', label: 'Manage Inventory Rules', description: 'Manage stock reorder points & protected inventory operations', group: 'Inventory', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'locations.archive', label: 'Archive Locations', description: 'Archive warehouse/store locations', group: 'Inventory', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true }
    ]
  },
  {
    id: 'supplier_mapping',
    name: 'Supplier & Vendor Product Mappings',
    description: 'Supplier product mapping & cost configurations',
    permissions: [
      { key: 'supplier_mapping.view', label: 'View Supplier Mappings', description: 'View supplier SKU & cost mappings', group: 'Supplier Mapping', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'supplier_mapping.manage', label: 'Manage Supplier Mappings', description: 'Create or edit supplier SKU mappings & costs', group: 'Supplier Mapping', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE }
    ]
  },
  {
    id: 'orders',
    name: 'Orders & Fulfillment',
    description: 'Customer sales orders processing',
    permissions: [
      { key: 'orders.view', label: 'View Orders', description: 'View sales orders and statuses', group: 'Orders', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'orders.create', label: 'Create Orders', description: 'Create manual or backend orders', group: 'Orders', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'orders.update', label: 'Update Orders', description: 'Edit order statuses & line items', group: 'Orders', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'orders.confirm', label: 'Confirm Orders', description: 'Confirm pending orders and lock reservation', group: 'Orders', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION },
      { key: 'orders.cancel', label: 'Cancel Orders', description: 'Cancel orders & release stock', group: 'Orders', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'orders.fulfill', label: 'Fulfill Orders', description: 'Process order fulfillment & tracking', group: 'Orders', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION },
      { key: 'orders.hold', label: 'Hold / Unhold Orders', description: 'Place or release order holds', group: 'Orders', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION }
    ]
  },
  {
    id: 'customers',
    name: 'Customers & CRM',
    description: 'Customer profiles, addresses, order history, tags, notes, and dynamic segments',
    permissions: [
      { key: 'customers.view', label: 'View Customers', description: 'Browse customer list, detail profiles, and metrics', group: 'Customers', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'customers.create', label: 'Create Customer', description: 'Add new customer profiles to store CRM', group: 'Customers', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'customers.update', label: 'Edit Customer', description: 'Modify customer profile details & tags', group: 'Customers', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'customers.archive', label: 'Archive Customer', description: 'Archive customer profiles while preserving historical order logs', group: 'Customers', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'customers.merge', label: 'Merge Customers', description: 'Deduplicate and merge customer profiles', group: 'Customers', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'customers.notes', label: 'Manage Customer Notes', description: 'Create and view internal staff notes on customer accounts', group: 'Customers', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'customers.addresses', label: 'Manage Customer Addresses', description: 'Add, update, or remove shipping/billing addresses for customers', group: 'Customers', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'customers.tags', label: 'Manage Customer Tags', description: 'Assign or remove organizational tags on customer profiles', group: 'Customers', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.WRITE },
      { key: 'customers.consent', label: 'Update Marketing Consent', description: 'Record customer marketing consent changes with audit log', group: 'Customers', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'customers.segments.view', label: 'View Customer Segments', description: 'View dynamic customer segments & membership rules', group: 'Customers', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'customers.segments.manage', label: 'Manage Customer Segments', description: 'Create, update, or archive dynamic customer segment rules', group: 'Customers', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE }
    ]
  },
  {
    id: 'vendors',
    name: 'Vendors & Suppliers',
    description: 'Supplier contacts, products, and procurement operations',
    permissions: [
      { key: 'vendors.view', label: 'View Vendors', description: 'Inspect vendor profiles & ledgers', group: 'Vendors', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'vendors.create', label: 'Add Vendors', description: 'Create supplier profiles', group: 'Vendors', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'vendors.update', label: 'Edit Vendors', description: 'Update supplier details', group: 'Vendors', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'vendors.archive', label: 'Archive Vendors', description: 'Archive vendor profiles', group: 'Vendors', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'vendors.manage_products', label: 'Manage Vendor Products', description: 'Map vendor products, costs, and lead times', group: 'Vendors', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE }
    ]
  },
  {
    id: 'procurement',
    name: 'Procurement & Purchase Orders',
    description: 'Purchase orders generation, approval, submission, and exceptions',
    permissions: [
      { key: 'procurement.view', label: 'View Purchase Orders', description: 'View purchase orders and statuses', group: 'Procurement', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'procurement.create', label: 'Create Purchase Orders', description: 'Create manual purchase orders', group: 'Procurement', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'procurement.update', label: 'Update Purchase Orders', description: 'Edit purchase orders and line items', group: 'Procurement', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'procurement.approve', label: 'Approve Purchase Orders', description: 'Approve pending purchase orders', group: 'Procurement', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'procurement.submit', label: 'Submit Purchase Orders', description: 'Submit purchase orders to vendors', group: 'Procurement', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION },
      { key: 'procurement.cancel', label: 'Cancel Purchase Orders', description: 'Cancel active purchase orders', group: 'Procurement', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'procurement.receive', label: 'Receive Purchase Orders', description: 'Acknowledge item fulfillment for purchase orders', group: 'Procurement', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION },
      { key: 'procurement.auto_order', label: 'Trigger Auto Procurement', description: 'Trigger automatic procurement evaluation for inventory or sales orders', group: 'Procurement', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION }
    ]
  },
  {
    id: 'payments',
    name: 'Payments & Gateways',
    description: 'Payment transactions and refunds',
    permissions: [
      { key: 'payments.view', label: 'View Payments', description: 'View transaction records', group: 'Payments', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'payments.create', label: 'Process Payments', description: 'Charge or record payments', group: 'Payments', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.WRITE },
      { key: 'payments.approve', label: 'Approve Refunds / High-Value Payments', description: 'Approve large refunds or financial payouts', group: 'Payments', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.ACTION, isHighRisk: true }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Ledgers, balances, and financial management',
    permissions: [
      { key: 'finance.view', label: 'View Financial Records', description: 'View store revenues and expenses', group: 'Finance', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'finance.manage', label: 'Manage Accounting Ledgers', description: 'Edit balances, payout settings, and tax profiles', group: 'Finance', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true }
    ]
  },
  {
    id: 'settings',
    name: 'Business Settings',
    description: 'Store preferences, currency & localization',
    permissions: [
      { key: 'settings.view', label: 'View Settings', description: 'Inspect store settings', group: 'Settings', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'settings.update', label: 'Update Business Settings', description: 'Change business name, currency, timezone, locale', group: 'Settings', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE }
    ]
  },
  {
    id: 'security',
    name: 'Security & Audit Logs',
    description: 'Security policies, step-up auth, and audit trail',
    permissions: [
      { key: 'security.view', label: 'View Security Audit Logs', description: 'View login history and security events', group: 'Security', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'security.manage', label: 'Manage Security Policies', description: 'Configure MFA policies, session timeouts, and IP rules', group: 'Security', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Reporting',
    description: 'Business intelligence, report builder, snapshots, and scheduled exports',
    permissions: [
      { key: 'analytics.view', label: 'View Analytics Overview', description: 'View high-level analytics dashboard and metrics', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.sales.view', label: 'View Sales Analytics', description: 'View sales revenues and order totals', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.orders.view', label: 'View Order Analytics', description: 'View order status trends and breakdowns', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.profit.view', label: 'View Profit Analytics', description: 'View margin, vendor costs, and profit metrics', group: 'Analytics', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'analytics.products.view', label: 'View Product Performance', description: 'View top sellers and stock turnover', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.inventory.view', label: 'View Inventory Analytics', description: 'View inventory valuations and stockout metrics', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.customers.view', label: 'View Customer Analytics', description: 'View customer cohorts and repeat rate metrics', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.vendors.view', label: 'View Vendor Analytics', description: 'View vendor order volume and payable totals', group: 'Analytics', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'analytics.procurement.view', label: 'View Procurement Analytics', description: 'View purchase order analytics and supplier performance', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.payments.view', label: 'View Payment Analytics', description: 'View payment success rates and refund metrics', group: 'Analytics', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'analytics.shipping.view', label: 'View Shipping & RTO Analytics', description: 'View courier performance, delivery SLA, and RTO rates', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.returns.view', label: 'View Return Analytics', description: 'View customer return requests and inspection metrics', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.marketing.view', label: 'View Marketing & Communication Analytics', description: 'View campaign delivery rates and message analytics', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.automation.view', label: 'View Automation & AI Analytics', description: 'View workflow run metrics and AI recommendation stats', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.exceptions.view', label: 'View Exception Analytics', description: 'View exception resolution time and backlog trends', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.READ },
      { key: 'analytics.export', label: 'Export Analytics Reports', description: 'Generate CSV/XLSX analytics exports', group: 'Analytics', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.ACTION },
      { key: 'analytics.reports.create', label: 'Create Saved Reports', description: 'Save custom report configurations', group: 'Analytics', riskLevel: PermissionRiskLevel.LOW, classification: PermissionClassification.WRITE },
      { key: 'analytics.reports.manage', label: 'Manage Saved Reports', description: 'Edit or delete custom report configurations', group: 'Analytics', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE },
      { key: 'analytics.scheduled_reports.manage', label: 'Manage Scheduled Reports', description: 'Configure recurring scheduled analytics deliveries', group: 'Analytics', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.WRITE }
    ]
  },
  {
    id: 'platform',
    name: 'Platform & SaaS Super Admin',
    description: 'Sellzy platform super admin controls, tenant management, billing plans, integrations, and health',
    permissions: [
      { key: 'platform.dashboard.view', label: 'View Platform Dashboard', description: 'View Super Admin platform KPI overview', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.tenants.view', label: 'View Tenants', description: 'View all tenant accounts and statuses', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.tenants.manage', label: 'Manage Tenants', description: 'Create or update tenant accounts', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'platform.tenants.suspend', label: 'Suspend Tenants', description: 'Suspend tenant accounts', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'platform.tenants.reactivate', label: 'Reactivate Tenants', description: 'Reactivate suspended tenant accounts', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.ACTION, isHighRisk: true },
      { key: 'platform.plans.view', label: 'View SaaS Plans', description: 'View platform SaaS plans and entitlements', group: 'Platform', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'platform.plans.manage', label: 'Manage SaaS Plans', description: 'Create and update SaaS plan definitions', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'platform.subscriptions.view', label: 'View Subscriptions', description: 'View tenant SaaS subscriptions', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.subscriptions.manage', label: 'Manage Subscriptions', description: 'Override or change tenant subscriptions', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'platform.integrations.view', label: 'View Integrations', description: 'View global integration providers', group: 'Platform', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'platform.integrations.manage', label: 'Manage Integrations', description: 'Configure platform integration providers', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'platform.webhooks.view', label: 'View Global Webhooks', description: 'View platform outbound webhook engines', group: 'Platform', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'platform.webhooks.manage', label: 'Manage Global Webhooks', description: 'Configure platform webhook delivery settings', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'platform.api_keys.view', label: 'View Platform API Keys', description: 'View tenant API key metrics', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.api_keys.manage', label: 'Manage Platform API Keys', description: 'Revoke or manage tenant API keys', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true },
      { key: 'platform.usage.view', label: 'View Platform Usage', description: 'View tenant resource consumption and quota metrics', group: 'Platform', riskLevel: PermissionRiskLevel.MEDIUM, classification: PermissionClassification.READ },
      { key: 'platform.system_health.view', label: 'View System Health', description: 'View DB, Redis, API, and Worker health status', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.queues.view', label: 'View Queue Monitoring', description: 'View BullMQ queue statistics and failed jobs', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.audit.view', label: 'View Platform Audit', description: 'View platform admin audit logs', group: 'Platform', riskLevel: PermissionRiskLevel.HIGH, classification: PermissionClassification.READ },
      { key: 'platform.settings.manage', label: 'Manage Platform Settings', description: 'Manage global SaaS settings and maintenance mode', group: 'Platform', riskLevel: PermissionRiskLevel.CRITICAL, classification: PermissionClassification.WRITE, isHighRisk: true }
    ]
  }
];

export const ALL_PERMISSION_KEYS = PERMISSIONS_CATALOG.flatMap(group => group.permissions.map(p => p.key));
