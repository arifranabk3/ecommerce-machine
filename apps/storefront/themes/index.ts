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
  'lusion': {
    id: 'lusion',
    name: 'Lusion',
    slug: 'lusion',
    folderName: 'lusion',
    version: '1.0.0',
    description: 'A premium, modern multipurpose e-commerce theme with vibrant accents.',
    status: 'active',
    categories: ['Multipurpose', 'Electronics', 'Technology', 'Fashion'],
    previewUrl: '/previews/lusion.png',
    demoUrl: 'https://demo.sellzy.com/lusion',
    supportedPages: ['home', 'shop', 'product', 'cart', 'checkout', 'account', 'orders', 'addresses', 'login', 'register'],
    supportedComponents: ['header', 'footer', 'product-card', 'mega-menu', 'drawer'],
    supportedSections: ['hero', 'featured-products', 'banners', 'newsletter'],
    features: ['quick-view', 'wishlist', 'compare'],
    designTokens: {},
    typography: { primary: 'Outfit', secondary: 'Inter' },
    colors: { primary: '#2563eb', secondary: '#1e293b', accent: '#3b82f6', bg: '#ffffff' },
    layout: { containerWidth: '1280px', borderRadius: '0.5rem' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'mate': {
    id: 'mate',
    name: 'Mate',
    slug: 'mate',
    folderName: 'mate',
    version: '1.0.0',
    description: 'Elegant, earthy theme perfect for home decor and furniture.',
    status: 'active',
    categories: ['Furniture', 'Interior', 'Home Decor'],
    previewUrl: '/previews/mate.png',
    demoUrl: 'https://demo.sellzy.com/mate',
    supportedPages: ['home', 'shop', 'product', 'cart'],
    supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero', 'lookbook', 'categories'],
    features: ['room-builder'],
    designTokens: {},
    typography: { primary: 'Playfair Display', secondary: 'Lato' },
    colors: { primary: '#6B705C', secondary: '#A5A58D', accent: '#DDBEA9', bg: '#FFE8D6' },
    layout: { containerWidth: '1440px', borderRadius: '0px' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'weare': {
    id: 'weare',
    name: 'Weäre',
    slug: 'weare',
    folderName: 'weare',
    version: '1.0.0',
    description: 'High-end luxury and minimal fashion theme.',
    status: 'active',
    categories: ['Fashion', 'Jewelry', 'Luxury', 'Clothing'],
    previewUrl: '/previews/weare.png',
    demoUrl: 'https://demo.sellzy.com/weare',
    supportedPages: ['home', 'shop', 'product', 'cart'],
    supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero-video', 'editorial', 'collections'],
    features: ['infinite-scroll', 'size-guide'],
    designTokens: {},
    typography: { primary: 'Cinzel', secondary: 'Montserrat' },
    colors: { primary: '#000000', secondary: '#333333', accent: '#C5A880', bg: '#FAFAFA' },
    layout: { containerWidth: '100%', borderRadius: '0px' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'ubone': {
    id: 'ubone',
    name: 'Ubone',
    slug: 'ubone',
    folderName: 'ubone',
    version: '1.0.0',
    description: 'Bold, street-style fashion and sneakers theme.',
    status: 'active',
    categories: ['Fashion', 'Shoes', 'Sports', 'Streetwear'],
    previewUrl: '/previews/ubone.png',
    demoUrl: 'https://demo.sellzy.com/ubone',
    supportedPages: ['home', 'shop', 'product', 'cart'],
    supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero-slider', 'countdown', 'sneaker-drops'],
    features: ['flash-sales', 'stock-scarcity'],
    designTokens: {},
    typography: { primary: 'Oswald', secondary: 'Roboto Condensed' },
    colors: { primary: '#FF3366', secondary: '#111111', accent: '#00E5FF', bg: '#F4F4F4' },
    layout: { containerWidth: '1320px', borderRadius: '0.25rem' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'gluck': {
    id: 'gluck',
    name: 'Gluck',
    slug: 'gluck',
    folderName: 'gluck',
    version: '1.0.0',
    description: 'Clean, organic theme for cosmetics and beauty products.',
    status: 'active',
    categories: ['Beauty', 'Cosmetics', 'Organic', 'Perfume'],
    previewUrl: '/previews/gluck.png',
    demoUrl: 'https://demo.sellzy.com/gluck',
    supportedPages: ['home', 'shop', 'product', 'cart'],
    supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero-soft', 'ingredients', 'testimonials'],
    features: ['subscription', 'bundle-builder'],
    designTokens: {},
    typography: { primary: 'Cormorant Garamond', secondary: 'Nunito' },
    colors: { primary: '#9B8B7B', secondary: '#D4C9BD', accent: '#F3ECE7', bg: '#FDFAF7' },
    layout: { containerWidth: '1200px', borderRadius: '1rem' },
    responsiveConfig: { breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 } },
    componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'moduva': {
    id: 'moduva',
    name: 'Moduva (Sandbox)',
    slug: 'moduva',
    folderName: 'moduva',
    version: '1.0.0',
    description: 'Sandbox theme for testing.',
    status: 'active',
    categories: ['Sandbox'],
    previewUrl: '', demoUrl: '',
    supportedPages: ['home'],
    supportedComponents: [], supportedSections: [], features: [],
    designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
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
