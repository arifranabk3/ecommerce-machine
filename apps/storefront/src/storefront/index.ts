/**
 * Storefront/Tenant Resolution Foundation
 */

export interface StoreContext {
  storeId: string;
  themeId: string;
  domain: string;
  name: string;
}

// In production, this will look up the tenant by hostname from the DB
export async function resolveStorefront(hostname?: string): Promise<StoreContext> {
  // Sandbox default to 'moduva'
  return {
    storeId: 'store_123',
    themeId: 'moduva',
    domain: hostname || 'localhost',
    name: 'Sellzy Demo Store',
  };
}
