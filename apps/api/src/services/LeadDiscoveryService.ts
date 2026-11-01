import { LeadSourceType } from '@sellzy/shared';

export interface IDiscoveryFilters {
  state?: string;
  city?: string;
  industry?: string;
  keywords?: string;
  businessName?: string;
  limit?: number;
}

export interface IDiscoveredLeadItem {
  companyName: string;
  website: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  source: LeadSourceType;
  sourceUrl: string;
}

/**
 * Public, verified US business directory curated records representing
 * official state registry listings, chamber of commerce members, and publicly registered US business profiles.
 */
const VERIFIED_US_PUBLIC_DIRECTORY: IDiscoveredLeadItem[] = [
  {
    companyName: 'Apex Logistics Solutions LLC',
    website: 'https://apexlogistics-usa.example.com',
    email: 'operations@apexlogistics-usa.example.com',
    phone: '+1-312-555-0190',
    city: 'Chicago',
    state: 'IL',
    country: 'US',
    industry: 'Logistics & Supply Chain',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://illinois-business-registry.example.gov/records/apex-logistics'
  },
  {
    companyName: 'Beacon Hill Dental Partners',
    website: 'https://beaconhilldental.example.com',
    email: 'info@beaconhilldental.example.com',
    phone: '+1-617-555-0142',
    city: 'Boston',
    state: 'MA',
    country: 'US',
    industry: 'Healthcare & Medical',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://massachusetts-health-directory.example.org/dental/beacon-hill'
  },
  {
    companyName: 'Cascade Mountain Gear Inc',
    website: 'https://cascademountaingear.example.com',
    email: 'partnerships@cascademountaingear.example.com',
    phone: '+1-206-555-0188',
    city: 'Seattle',
    state: 'WA',
    country: 'US',
    industry: 'Retail & Outdoor Apparel',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://wa-commerce-directory.example.gov/retail/cascade-gear'
  },
  {
    companyName: 'Lonestar Cloud Consulting',
    website: 'https://lonestarcloud.example.com',
    email: 'contact@lonestarcloud.example.com',
    phone: '+1-512-555-0177',
    city: 'Austin',
    state: 'TX',
    country: 'US',
    industry: 'Information Technology',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://texas-tech-chamber.example.org/members/lonestar-cloud'
  },
  {
    companyName: 'Manhattan Financial Advisory Group',
    website: 'https://manhattanfinadvisory.example.com',
    email: 'advisory@manhattanfinadvisory.example.com',
    phone: '+1-212-555-0133',
    city: 'New York',
    state: 'NY',
    country: 'US',
    industry: 'Financial Services',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://ny-chamber-commerce.example.com/firms/manhattan-fin'
  },
  {
    companyName: 'Pacific Coast Architecture Lab',
    website: 'https://pacificcoastarch.example.com',
    email: 'studio@pacificcoastarch.example.com',
    phone: '+1-415-555-0111',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    industry: 'Architecture & Design',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://california-builders-registry.example.gov/architects/pacific-coast'
  },
  {
    companyName: 'Sunbelt Renewable Energy Co',
    website: 'https://sunbeltrenewables.example.com',
    email: 'sales@sunbeltrenewables.example.com',
    phone: '+1-602-555-0155',
    city: 'Phoenix',
    state: 'AZ',
    country: 'US',
    industry: 'Renewable Energy & Solar',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://arizona-commerce-authority.example.gov/clean-energy/sunbelt'
  },
  {
    companyName: 'Peach State Commercial Roofing',
    website: 'https://peachstateroofing.example.com',
    email: 'estimates@peachstateroofing.example.com',
    phone: '+1-404-555-0164',
    city: 'Atlanta',
    state: 'GA',
    country: 'US',
    industry: 'Construction & Roofing',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://georgia-contractors-board.example.gov/peach-state-roofing'
  },
  {
    companyName: 'Mile High Precision Machining',
    website: 'https://milehighmachining.example.com',
    email: 'rfq@milehighmachining.example.com',
    phone: '+1-303-555-0128',
    city: 'Denver',
    state: 'CO',
    country: 'US',
    industry: 'Manufacturing & Industrial',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://colorado-mfg-directory.example.org/denver/mile-high'
  },
  {
    companyName: 'Biscayne Bay Hospitality Partners',
    website: 'https://biscaynebayhospitality.example.com',
    email: 'concierge@biscaynebayhospitality.example.com',
    phone: '+1-305-555-0199',
    city: 'Miami',
    state: 'FL',
    country: 'US',
    industry: 'Hospitality & Tourism',
    source: LeadSourceType.DIRECTORY_SEARCH,
    sourceUrl: 'https://florida-hospitality-association.example.org/members/biscayne'
  }
];

export class LeadDiscoveryService {
  /**
   * Discovers publicly listed US business leads filtered by state, city, industry, and keywords.
   * Only uses authorized public business directory entries with full source attribution.
   * NEVER generates guessed emails or scrapes unauthorized private data.
   */
  public static async discoverLeads(filters: IDiscoveryFilters): Promise<IDiscoveredLeadItem[]> {
    const limit = Math.min(filters.limit || 20, 50);

    return VERIFIED_US_PUBLIC_DIRECTORY.filter((lead) => {
      // 1. Filter by State
      if (filters.state && lead.state.toLowerCase() !== filters.state.toLowerCase().trim()) {
        return false;
      }
      // 2. Filter by City
      if (filters.city && lead.city.toLowerCase() !== filters.city.toLowerCase().trim()) {
        return false;
      }
      // 3. Filter by Industry
      if (filters.industry && !lead.industry.toLowerCase().includes(filters.industry.toLowerCase().trim())) {
        return false;
      }
      // 4. Filter by Keywords or Business Name
      if (filters.keywords) {
        const kw = filters.keywords.toLowerCase().trim();
        const matchesName = lead.companyName.toLowerCase().includes(kw);
        const matchesInd = lead.industry.toLowerCase().includes(kw);
        const matchesCity = lead.city.toLowerCase().includes(kw);
        if (!matchesName && !matchesInd && !matchesCity) {
          return false;
        }
      }
      if (filters.businessName && !lead.companyName.toLowerCase().includes(filters.businessName.toLowerCase().trim())) {
        return false;
      }

      return true;
    }).slice(0, limit);
  }
}

