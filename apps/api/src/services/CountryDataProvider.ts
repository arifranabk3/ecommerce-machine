import { LeadSourceType, ISupportedCountry } from '@sellzy/shared';

export interface IDiscoveredBusinessLead {
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

export interface ICountryDataProvider {
  readonly providerId: string;
  readonly providerName: string;
  readonly supportedCountries: string[];
  supportsCountry(countryCode: string): boolean;
  discoverLeads(filters: {
    country: string;
    industry?: string;
    state?: string;
    city?: string;
    businessName?: string;
    website?: string;
    limit?: number;
  }): Promise<IDiscoveredBusinessLead[]>;
}

// 1. United States Official Registry & Chamber Directory
export class USDirectoryProvider implements ICountryDataProvider {
  public readonly providerId = 'us_public_directory';
  public readonly providerName = 'US Commercial State Registry & Chamber Provider';
  public readonly supportedCountries = ['US', 'USA'];

  public supportsCountry(countryCode: string): boolean {
    return this.supportedCountries.includes(countryCode.toUpperCase());
  }

  public async discoverLeads(filters: {
    country: string;
    industry?: string;
    state?: string;
    city?: string;
    businessName?: string;
    website?: string;
    limit?: number;
  }): Promise<IDiscoveredBusinessLead[]> {
    const rawData: IDiscoveredBusinessLead[] = [
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
        industry: 'Retail & Apparel',
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
      }
    ];

    return this.applyFilters(rawData, filters);
  }

  private applyFilters(data: IDiscoveredBusinessLead[], filters: any): IDiscoveredBusinessLead[] {
    const limit = Math.min(filters.limit || 20, 50);
    return data.filter(item => {
      if (filters.state && item.state.toLowerCase() !== filters.state.toLowerCase().trim()) return false;
      if (filters.city && item.city.toLowerCase() !== filters.city.toLowerCase().trim()) return false;
      if (filters.industry && !item.industry.toLowerCase().includes(filters.industry.toLowerCase().trim())) return false;
      if (filters.businessName && !item.companyName.toLowerCase().includes(filters.businessName.toLowerCase().trim())) return false;
      return true;
    }).slice(0, limit);
  }
}

// 2. United Kingdom Companies House & Trade Register
export class UKCompaniesHouseProvider implements ICountryDataProvider {
  public readonly providerId = 'uk_companies_house';
  public readonly providerName = 'UK Official Companies Registry & Trade Directory';
  public readonly supportedCountries = ['GB', 'UK'];

  public supportsCountry(countryCode: string): boolean {
    return this.supportedCountries.includes(countryCode.toUpperCase());
  }

  public async discoverLeads(filters: {
    country: string;
    industry?: string;
    state?: string;
    city?: string;
    businessName?: string;
    website?: string;
    limit?: number;
  }): Promise<IDiscoveredBusinessLead[]> {
    const rawData: IDiscoveredBusinessLead[] = [
      {
        companyName: 'Thames FinTech Solutions Ltd',
        website: 'https://thamesfintech.co.uk.example.com',
        email: 'hello@thamesfintech.co.uk.example.com',
        phone: '+44-20-7946-0120',
        city: 'London',
        state: 'England',
        country: 'GB',
        industry: 'Financial Technology',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://find-and-update.company-information.service.gov.uk.example.gov/company/09876543'
      },
      {
        companyName: 'Edinburgh Cloud Infrastructure PLC',
        website: 'https://edinburghcloud.co.uk.example.com',
        email: 'contact@edinburghcloud.co.uk.example.com',
        phone: '+44-131-496-0210',
        city: 'Edinburgh',
        state: 'Scotland',
        country: 'GB',
        industry: 'Cloud Computing',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://find-and-update.company-information.service.gov.uk.example.gov/company/11223344'
      },
      {
        companyName: 'Manchester Precision Logistics Ltd',
        website: 'https://manchesterlogistics.co.uk.example.com',
        email: 'dispatch@manchesterlogistics.co.uk.example.com',
        phone: '+44-161-496-0330',
        city: 'Manchester',
        state: 'Greater Manchester',
        country: 'GB',
        industry: 'Logistics & Supply Chain',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://find-and-update.company-information.service.gov.uk.example.gov/company/55667788'
      }
    ];

    const limit = Math.min(filters.limit || 20, 50);
    return rawData.filter(item => {
      if (filters.city && item.city.toLowerCase() !== filters.city.toLowerCase().trim()) return false;
      if (filters.industry && !item.industry.toLowerCase().includes(filters.industry.toLowerCase().trim())) return false;
      if (filters.businessName && !item.companyName.toLowerCase().includes(filters.businessName.toLowerCase().trim())) return false;
      return true;
    }).slice(0, limit);
  }
}

// 3. Canada Federal Corporations & Chamber Directory
export class CanadaCorporationsProvider implements ICountryDataProvider {
  public readonly providerId = 'canada_corporations';
  public readonly providerName = 'Corporations Canada Business Registry';
  public readonly supportedCountries = ['CA', 'CAN'];

  public supportsCountry(countryCode: string): boolean {
    return this.supportedCountries.includes(countryCode.toUpperCase());
  }

  public async discoverLeads(filters: {
    country: string;
    industry?: string;
    state?: string;
    city?: string;
    businessName?: string;
    website?: string;
    limit?: number;
  }): Promise<IDiscoveredBusinessLead[]> {
    const rawData: IDiscoveredBusinessLead[] = [
      {
        companyName: 'Maple Leaf Clean Energy Inc',
        website: 'https://mapleleafenergy.ca.example.com',
        email: 'info@mapleleafenergy.ca.example.com',
        phone: '+1-416-555-0144',
        city: 'Toronto',
        state: 'ON',
        country: 'CA',
        industry: 'Clean Energy & Solar',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://ised-isde.canada.ca.example.gov/corp-search/maple-leaf'
      },
      {
        companyName: 'Pacific Rim Robotics Corp',
        website: 'https://pacificrimrobotics.ca.example.com',
        email: 'sales@pacificrimrobotics.ca.example.com',
        phone: '+1-604-555-0192',
        city: 'Vancouver',
        state: 'BC',
        country: 'CA',
        industry: 'Robotics & Automation',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://ised-isde.canada.ca.example.gov/corp-search/pacific-rim'
      }
    ];

    const limit = Math.min(filters.limit || 20, 50);
    return rawData.filter(item => {
      if (filters.state && item.state.toLowerCase() !== filters.state.toLowerCase().trim()) return false;
      if (filters.city && item.city.toLowerCase() !== filters.city.toLowerCase().trim()) return false;
      if (filters.industry && !item.industry.toLowerCase().includes(filters.industry.toLowerCase().trim())) return false;
      return true;
    }).slice(0, limit);
  }
}

// 4. Australia Business Register (ABR) Provider
export class AustraliaBusinessRegistryProvider implements ICountryDataProvider {
  public readonly providerId = 'au_business_register';
  public readonly providerName = 'Australian Business Register (ABR) & ASIC';
  public readonly supportedCountries = ['AU', 'AUS'];

  public supportsCountry(countryCode: string): boolean {
    return this.supportedCountries.includes(countryCode.toUpperCase());
  }

  public async discoverLeads(filters: {
    country: string;
    industry?: string;
    state?: string;
    city?: string;
    businessName?: string;
    website?: string;
    limit?: number;
  }): Promise<IDiscoveredBusinessLead[]> {
    const rawData: IDiscoveredBusinessLead[] = [
      {
        companyName: 'Harbour City BioTech Pty Ltd',
        website: 'https://harbourcitybiotech.com.au.example.com',
        email: 'enquiries@harbourcitybiotech.com.au.example.com',
        phone: '+61-2-9000-0111',
        city: 'Sydney',
        state: 'NSW',
        country: 'AU',
        industry: 'Biotechnology & Health',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://abr.business.gov.au.example.gov/ABN/View?id=12345678901'
      },
      {
        companyName: 'Yarra Valley Agricultural Tech Pty Ltd',
        website: 'https://yarravalleyagri.com.au.example.com',
        email: 'support@yarravalleyagri.com.au.example.com',
        phone: '+61-3-9000-0222',
        city: 'Melbourne',
        state: 'VIC',
        country: 'AU',
        industry: 'Agricultural Technology',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://abr.business.gov.au.example.gov/ABN/View?id=98765432109'
      }
    ];

    const limit = Math.min(filters.limit || 20, 50);
    return rawData.filter(item => {
      if (filters.state && item.state.toLowerCase() !== filters.state.toLowerCase().trim()) return false;
      if (filters.city && item.city.toLowerCase() !== filters.city.toLowerCase().trim()) return false;
      if (filters.industry && !item.industry.toLowerCase().includes(filters.industry.toLowerCase().trim())) return false;
      return true;
    }).slice(0, limit);
  }
}

// 5. Germany Handelsregister Provider
export class GermanyHandelsregisterProvider implements ICountryDataProvider {
  public readonly providerId = 'de_handelsregister';
  public readonly providerName = 'German Commercial Register (Gemeinsames Registerportal der Länder)';
  public readonly supportedCountries = ['DE', 'DEU'];

  public supportsCountry(countryCode: string): boolean {
    return this.supportedCountries.includes(countryCode.toUpperCase());
  }

  public async discoverLeads(filters: {
    country: string;
    industry?: string;
    state?: string;
    city?: string;
    businessName?: string;
    website?: string;
    limit?: number;
  }): Promise<IDiscoveredBusinessLead[]> {
    const rawData: IDiscoveredBusinessLead[] = [
      {
        companyName: 'Bavaria Industrial Automation GmbH',
        website: 'https://bavariaindustrial.de.example.com',
        email: 'kontakt@bavariaindustrial.de.example.com',
        phone: '+49-89-1234-5678',
        city: 'Munich',
        state: 'Bavaria',
        country: 'DE',
        industry: 'Industrial Automation',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://www.handelsregister.de.example.gov/rp_web/search.do?company=bavaria-automation'
      },
      {
        companyName: 'Berlin Digital Logistics SE',
        website: 'https://berlindigitallogistics.de.example.com',
        email: 'info@berlindigitallogistics.de.example.com',
        phone: '+49-30-9876-5432',
        city: 'Berlin',
        state: 'Berlin',
        country: 'DE',
        industry: 'Logistics & Supply Chain',
        source: LeadSourceType.DIRECTORY_SEARCH,
        sourceUrl: 'https://www.handelsregister.de.example.gov/rp_web/search.do?company=berlin-logistics'
      }
    ];

    const limit = Math.min(filters.limit || 20, 50);
    return rawData.filter(item => {
      if (filters.city && item.city.toLowerCase() !== filters.city.toLowerCase().trim()) return false;
      if (filters.industry && !item.industry.toLowerCase().includes(filters.industry.toLowerCase().trim())) return false;
      return true;
    }).slice(0, limit);
  }
}

// Data Provider Registry
export class DataProviderRegistry {
  private static providers: ICountryDataProvider[] = [
    new USDirectoryProvider(),
    new UKCompaniesHouseProvider(),
    new CanadaCorporationsProvider(),
    new AustraliaBusinessRegistryProvider(),
    new GermanyHandelsregisterProvider()
  ];

  public static getSupportedCountries(): ISupportedCountry[] {
    return [
      { code: 'US', name: 'United States', flag: '🇺🇸', isSupported: true, providerName: 'US State Registry & Chamber', availableFilters: ['state', 'city', 'industry', 'businessName'] },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', isSupported: true, providerName: 'Companies House & Trade Directory', availableFilters: ['city', 'industry', 'businessName'] },
      { code: 'CA', name: 'Canada', flag: '🇨🇦', isSupported: true, providerName: 'Corporations Canada Registry', availableFilters: ['state', 'city', 'industry'] },
      { code: 'AU', name: 'Australia', flag: '🇦🇺', isSupported: true, providerName: 'Australian Business Register (ABR)', availableFilters: ['state', 'city', 'industry'] },
      { code: 'DE', name: 'Germany', flag: '🇩🇪', isSupported: true, providerName: 'Handelsregister Federal Portal', availableFilters: ['city', 'industry'] },
      { code: 'FR', name: 'France', flag: '🇫🇷', isSupported: false, availableFilters: [] },
      { code: 'IN', name: 'India', flag: '🇮🇳', isSupported: false, availableFilters: [] },
      { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', isSupported: false, availableFilters: [] },
      { code: 'JP', name: 'Japan', flag: '🇯🇵', isSupported: false, availableFilters: [] }
    ];
  }

  public static getProviderForCountry(countryCode: string): ICountryDataProvider | null {
    const cleanCode = (countryCode || '').trim().toUpperCase();
    return this.providers.find(p => p.supportsCountry(cleanCode)) || null;
  }
}
