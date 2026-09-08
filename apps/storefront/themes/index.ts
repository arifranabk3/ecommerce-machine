export interface ThemeConfig {
  id: string;
  name: string;
  slug: string;
  folderName: string;
  version: string;
  description: string;
  status: 'active' | 'beta' | 'deprecated';
  categories: string[];
  previewUrl: string;
  demoUrl: string;
  supportedPages: string[];
  supportedComponents: string[];
  supportedSections: string[];
  features: string[];
  designTokens: Record<string, any>;
  typography: Record<string, any>;
  colors: Record<string, any>;
  layout: Record<string, any>;
  responsiveConfig: Record<string, any>;
  componentMappings: Record<string, string>;
  pageMappings: Record<string, string>;
  cmsMappings: Record<string, string>;
  featureFlags: Record<string, boolean>;
}

// Example Categories as requested
export const THEME_CATEGORIES = [
  'Multipurpose', 'Fashion', 'Clothing', 'Jewelry', 'Luxury', 'Watches',
  'Beauty', 'Cosmetics', 'Perfume', 'Furniture', 'Interior', 'Home Decor',
  'Electronics', 'Technology', 'Gaming', 'Grocery', 'Food', 'Organic',
  'Sports', 'Shoes', 'Automotive', 'Kids', 'Baby', 'Books', 'Handmade',
  'Creative', 'Single Product'
];

export const themeRegistry: Record<string, ThemeConfig> = {
  'moduva': {
    id: 'thm_moduva_01',
    name: 'Moduva',
    slug: 'moduva',
    folderName: 'moduva',
    version: '1.0.0',
    description: 'A clean, minimal fashion theme.',
    status: 'active',
    categories: ['Fashion', 'Clothing', 'Minimal'],
    previewUrl: '/previews/moduva.png',
    demoUrl: 'https://demo.sellzy.com/moduva',
    supportedPages: ['home', 'product', 'category', 'cart', 'checkout'],
    supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero', 'featured-products'],
    features: ['quick-view', 'mega-menu'],
    designTokens: {},
    typography: { primary: 'Inter', secondary: 'Playfair Display' },
    colors: { primary: '#000000', secondary: '#ffffff', accent: '#e5e5e5' },
    layout: { containerWidth: '1440px' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {},
    pageMappings: {},
    cmsMappings: {},
    featureFlags: { useNewCheckout: true }
  },
  'lusion': {
    id: 'thm_lusion_01',
    name: 'Lusion',
    slug: 'lusion',
    folderName: 'lusion',
    version: '1.2.0',
    description: 'A multipurpose e-commerce theme.',
    status: 'active',
    categories: ['Multipurpose', 'Electronics', 'Technology'],
    previewUrl: '/previews/lusion.png',
    demoUrl: 'https://demo.sellzy.com/lusion',
    supportedPages: ['home', 'product', 'category', 'cart', 'checkout', 'blog'],
    supportedComponents: ['header', 'footer', 'product-card', 'newsletter'],
    supportedSections: ['hero', 'featured-products', 'testimonials'],
    features: ['quick-view', 'mega-menu', 'wishlist'],
    designTokens: {},
    typography: { primary: 'Roboto', secondary: 'Open Sans' },
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    layout: { containerWidth: '1200px' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {},
    pageMappings: {},
    cmsMappings: {},
    featureFlags: { useNewCheckout: false }
  }
};

export function getThemeConfig(folderName: string): ThemeConfig | undefined {
  return themeRegistry[folderName];
}

export function getThemesByCategory(category: string): ThemeConfig[] {
  return Object.values(themeRegistry).filter(theme => 
    theme.categories.includes(category)
  );
}
