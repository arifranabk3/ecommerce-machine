export const SystemPermissions = {
  // Products
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  
  // Orders
  VIEW_ORDERS: 'VIEW_ORDERS',
  MANAGE_ORDERS: 'MANAGE_ORDERS',
  
  // Customers
  VIEW_CUSTOMERS: 'VIEW_CUSTOMERS',
  MANAGE_CUSTOMERS: 'MANAGE_CUSTOMERS',
  
  // Marketing & Communication
  CREATE_CAMPAIGN: 'CREATE_CAMPAIGN',
  SEND_MESSAGE: 'SEND_MESSAGE',
  MANAGE_TEMPLATES: 'MANAGE_TEMPLATES',
  
  // Analytics & Data
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  EXPORT_DATA: 'EXPORT_DATA',
  
  // Integrations
  MANAGE_INTEGRATIONS: 'MANAGE_INTEGRATIONS',
  CONNECT_INTEGRATION: 'CONNECT_INTEGRATION',
  CONFIGURE_INTEGRATION: 'CONFIGURE_INTEGRATION',
  ENABLE_INTEGRATION: 'ENABLE_INTEGRATION',
  DISABLE_INTEGRATION: 'DISABLE_INTEGRATION',
  SYNC_INTEGRATION: 'SYNC_INTEGRATION',
  VIEW_INTEGRATION_LOGS: 'VIEW_INTEGRATION_LOGS',
  
  // Admin & System
  MANAGE_BILLING: 'MANAGE_BILLING',
  MANAGE_TEAM: 'MANAGE_TEAM',
  MANAGE_STORE: 'MANAGE_STORE',
  MANAGE_THEMES: 'MANAGE_THEMES',
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
  API_ACCESS: 'API_ACCESS',
} as const;

export type PermissionKey = keyof typeof SystemPermissions;

export const DefaultRoles = {
  OWNER: {
    name: 'Owner',
    normalizedName: 'OWNER',
    description: 'Full access to all tenant resources and stores.',
    permissions: ['*'],
    systemRole: true,
  },
  ADMIN: {
    name: 'Admin',
    normalizedName: 'ADMIN',
    description: 'Administrative access to manage store, team, and settings.',
    permissions: Object.values(SystemPermissions),
    systemRole: true,
  },
  MANAGER: {
    name: 'Manager',
    normalizedName: 'MANAGER',
    description: 'Manage daily operations, orders, products, and customers.',
    permissions: [
      SystemPermissions.VIEW_PRODUCTS,
      SystemPermissions.MANAGE_PRODUCTS,
      SystemPermissions.VIEW_ORDERS,
      SystemPermissions.MANAGE_ORDERS,
      SystemPermissions.VIEW_CUSTOMERS,
      SystemPermissions.MANAGE_CUSTOMERS,
      SystemPermissions.VIEW_ANALYTICS,
    ],
    systemRole: true,
  },
  STAFF: {
    name: 'Staff',
    normalizedName: 'STAFF',
    description: 'Basic access to view and process orders.',
    permissions: [
      SystemPermissions.VIEW_PRODUCTS,
      SystemPermissions.VIEW_ORDERS,
      SystemPermissions.MANAGE_ORDERS,
      SystemPermissions.VIEW_CUSTOMERS,
    ],
    systemRole: true,
  }
};
