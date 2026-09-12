/**
 * Storefront/Tenant Resolution Foundation
 */

export interface StoreContext {
  storeId: string;
  themeId: string;
  domain: string;
  name: string;
  cmsData?: any;
  isPublished?: boolean;
}

export async function resolveStorefront(hostname?: string, preview?: boolean): Promise<StoreContext> {
  // In a real multi-tenant app, we'd lookup tenantId by hostname.
  // For this sandbox, we'll hardcode a demo tenantId.
  const tenantId = 'demo-tenant-1';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  try {
    const res = await fetch(`${apiUrl}/storefront/resolve?tenantId=${tenantId}${preview ? '&preview=true' : ''}`, {
      // In Next.js App Router, we can control caching here. We'll revalidate every 60s for demo purposes.
      next: { revalidate: 60 }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        storeId: tenantId,
        themeId: data.themeId || 'moduva',
        domain: hostname || 'localhost',
        name: 'Sellzy Demo Store',
        cmsData: data.data,
        isPublished: data.isPublished
      };
    }
  } catch (error) {
    console.error('Failed to resolve storefront from API, falling back to default', error);
  }

  // Fallback if API fails or no config exists
  return {
    storeId: tenantId,
    themeId: 'moduva',
    domain: hostname || 'localhost',
    name: 'Sellzy Demo Store',
  };
}
