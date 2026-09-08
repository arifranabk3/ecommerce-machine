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
  'tiano': {
    id: 'tiano', name: 'Tiano', slug: 'tiano', folderName: 'tiano', version: '1.0.0',
    description: 'Modern, clean fashion and clothing theme.', status: 'active',
    categories: ['Fashion', 'Clothing', 'Minimal'], previewUrl: '/previews/tiano.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'vogal': {
    id: 'vogal', name: 'Vogal', slug: 'vogal', folderName: 'vogal', version: '1.0.0',
    description: 'Multipurpose WooCommerce-style theme.', status: 'active',
    categories: ['Multipurpose', 'Electronics'], previewUrl: '/previews/vogal.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'wokiee': {
    id: 'wokiee', name: 'Wokiee', slug: 'wokiee', folderName: 'wokiee', version: '1.0.0',
    description: 'Premium multipurpose Shopify-style theme.', status: 'active',
    categories: ['Multipurpose', 'Fashion', 'Sports'], previewUrl: '/previews/wokiee.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'funore': {
    id: 'funore', name: 'Funore', slug: 'funore', folderName: 'funore', version: '1.0.0',
    description: 'Minimalist furniture and interior theme.', status: 'active',
    categories: ['Furniture', 'Interior'], previewUrl: '/previews/funore.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'zubbio': {
    id: 'zubbio', name: 'Zubbio', slug: 'zubbio', folderName: 'zubbio', version: '1.0.0',
    description: 'Watches and luxury accessories theme.', status: 'active',
    categories: ['Watches', 'Luxury', 'Jewelry'], previewUrl: '/previews/zubbio.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'vemus': {
    id: 'vemus', name: 'Vemus', slug: 'vemus', folderName: 'vemus', version: '1.0.0',
    description: 'High-performance automotive parts theme.', status: 'active',
    categories: ['Automotive'], previewUrl: '/previews/vemus.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'mirora': {
    id: 'mirora', name: 'Mirora', slug: 'mirora', folderName: 'mirora', version: '1.0.0',
    description: 'Elegant watch and timepieces theme.', status: 'active',
    categories: ['Watches', 'Luxury'], previewUrl: '/previews/mirora.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'aurum': {
    id: 'aurum', name: 'Aurum', slug: 'aurum', folderName: 'aurum', version: '1.0.0',
    description: 'Minimalist tech and electronics theme.', status: 'active',
    categories: ['Electronics', 'Technology'], previewUrl: '/previews/aurum.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'arome': {
    id: 'arome', name: 'Arome', slug: 'arome', folderName: 'arome', version: '1.0.0',
    description: 'Bakery, food, and culinary theme.', status: 'active',
    categories: ['Food', 'Bakery'], previewUrl: '/previews/arome.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'grocery': {
    id: 'grocery', name: 'Grocery', slug: 'grocery', folderName: 'grocery', version: '1.0.0',
    description: 'Fresh organic groceries and supermarket theme.', status: 'active',
    categories: ['Grocery', 'Food', 'Organic'], previewUrl: '/previews/grocery.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'organici': {
    id: 'organici', name: 'Organici', slug: 'organici', folderName: 'organici', version: '1.0.0',
    description: 'Organic farm, food, and healthy living theme.', status: 'active',
    categories: ['Organic', 'Food', 'Health'], previewUrl: '/previews/organici.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'ecommax': {
    id: 'ecommax', name: 'Ecommax', slug: 'ecommax', folderName: 'ecommax', version: '1.0.0',
    description: 'High-volume marketplace theme.', status: 'active',
    categories: ['Multipurpose', 'Electronics'], previewUrl: '/previews/ecommax.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'tonmart': {
    id: 'tonmart', name: 'Tonmart', slug: 'tonmart', folderName: 'tonmart', version: '1.0.0',
    description: 'Heavy tools and hardware equipment theme.', status: 'active',
    categories: ['Hardware', 'Tools', 'Automotive'], previewUrl: '/previews/tonmart.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'e-come': {
    id: 'e-come', name: 'E-come', slug: 'e-come', folderName: 'e-come', version: '1.0.0',
    description: 'Versatile digital marketplace theme.', status: 'active',
    categories: ['Multipurpose', 'Technology'], previewUrl: '/previews/e-come.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'],
    supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {},
    responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {}
  },
  'vela': { id: 'vela', name: 'Vela', slug: 'vela', folderName: 'vela', version: '1.0.0', description: 'Chic fashion theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'luxe': { id: 'luxe', name: 'Luxe', slug: 'luxe', folderName: 'luxe', version: '1.0.0', description: 'High-end luxury theme.', status: 'active', categories: ['Luxury', 'Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'gemoria': { id: 'gemoria', name: 'Gemoria', slug: 'gemoria', folderName: 'gemoria', version: '1.0.0', description: 'Fine jewelry theme.', status: 'active', categories: ['Jewelry'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'glow': { id: 'glow', name: 'Glow', slug: 'glow', folderName: 'glow', version: '1.0.0', description: 'Radiant beauty theme.', status: 'active', categories: ['Beauty', 'Cosmetics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'lumina': { id: 'lumina', name: 'Lumina', slug: 'lumina', folderName: 'lumina', version: '1.0.0', description: 'Clean cosmetics theme.', status: 'active', categories: ['Beauty'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'oak': { id: 'oak', name: 'Oak', slug: 'oak', folderName: 'oak', version: '1.0.0', description: 'Solid wood furniture theme.', status: 'active', categories: ['Furniture'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'havn': { id: 'havn', name: 'Havn', slug: 'havn', folderName: 'havn', version: '1.0.0', description: 'Nordic interior design theme.', status: 'active', categories: ['Interior', 'Furniture'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'techgo': { id: 'techgo', name: 'TechGo', slug: 'techgo', folderName: 'techgo', version: '1.0.0', description: 'Gadget store theme.', status: 'active', categories: ['Electronics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'nova': { id: 'nova', name: 'Nova', slug: 'nova', folderName: 'nova', version: '1.0.0', description: 'Modern electronics theme.', status: 'active', categories: ['Electronics', 'Technology'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'freshly': { id: 'freshly', name: 'Freshly', slug: 'freshly', folderName: 'freshly', version: '1.0.0', description: 'Fresh produce grocery theme.', status: 'active', categories: ['Grocery', 'Organic'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'market': { id: 'market', name: 'Market', slug: 'market', folderName: 'market', version: '1.0.0', description: 'Supermarket theme.', status: 'active', categories: ['Grocery', 'Food'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'active': { id: 'active', name: 'Active', slug: 'active', folderName: 'active', version: '1.0.0', description: 'Sportswear theme.', status: 'active', categories: ['Sports', 'Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'sprint': { id: 'sprint', name: 'Sprint', slug: 'sprint', folderName: 'sprint', version: '1.0.0', description: 'Running shoes theme.', status: 'active', categories: ['Shoes', 'Sports'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'kicks': { id: 'kicks', name: 'Kicks', slug: 'kicks', folderName: 'kicks', version: '1.0.0', description: 'Sneakerhead theme.', status: 'active', categories: ['Shoes', 'Streetwear'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'autox': { id: 'autox', name: 'AutoX', slug: 'autox', folderName: 'autox', version: '1.0.0', description: 'Auto parts theme.', status: 'active', categories: ['Automotive'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'gear': { id: 'gear', name: 'Gear', slug: 'gear', folderName: 'gear', version: '1.0.0', description: 'Motorcycle gear theme.', status: 'active', categories: ['Automotive', 'Sports'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'kiddos': { id: 'kiddos', name: 'Kiddos', slug: 'kiddos', folderName: 'kiddos', version: '1.0.0', description: 'Children clothing theme.', status: 'active', categories: ['Kids', 'Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'play': { id: 'play', name: 'Play', slug: 'play', folderName: 'play', version: '1.0.0', description: 'Kids toys theme.', status: 'active', categories: ['Kids'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'artisan': { id: 'artisan', name: 'Artisan', slug: 'artisan', folderName: 'artisan', version: '1.0.0', description: 'Creative handmade theme.', status: 'active', categories: ['Creative', 'Handmade'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'craft': { id: 'craft', name: 'Craft', slug: 'craft', folderName: 'craft', version: '1.0.0', description: 'Handcraft store theme.', status: 'active', categories: ['Handmade'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'infinity': { id: 'infinity', name: 'Infinity', slug: 'infinity', folderName: 'infinity', version: '1.0.0', description: 'Multipurpose megastore.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'prime': { id: 'prime', name: 'Prime', slug: 'prime', folderName: 'prime', version: '1.0.0', description: 'Premium multipurpose theme.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'bookish': { id: 'bookish', name: 'Bookish', slug: 'bookish', folderName: 'bookish', version: '1.0.0', description: 'Bookstore theme.', status: 'active', categories: ['Books'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'petz': { id: 'petz', name: 'Petz', slug: 'petz', folderName: 'petz', version: '1.0.0', description: 'Pet supplies theme.', status: 'active', categories: ['Pets', 'Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'planty': { id: 'planty', name: 'Planty', slug: 'planty', folderName: 'planty', version: '1.0.0', description: 'Plants and garden theme.', status: 'active', categories: ['Home Decor', 'Organic'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'vine': { id: 'vine', name: 'Vine', slug: 'vine', folderName: 'vine', version: '1.0.0', description: 'Wine and drinks theme.', status: 'active', categories: ['Food', 'Luxury'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'crave': { id: 'crave', name: 'Crave', slug: 'crave', folderName: 'crave', version: '1.0.0', description: 'Restaurant delivery theme.', status: 'active', categories: ['Food'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'zen': { id: 'zen', name: 'Zen', slug: 'zen', folderName: 'zen', version: '1.0.0', description: 'Wellness and yoga theme.', status: 'active', categories: ['Health', 'Sports'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'outdoors': { id: 'outdoors', name: 'Outdoors', slug: 'outdoors', folderName: 'outdoors', version: '1.0.0', description: 'Camping and gear theme.', status: 'active', categories: ['Sports', 'Creative'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'pulse': { id: 'pulse', name: 'Pulse', slug: 'pulse', folderName: 'pulse', version: '1.0.0', description: 'Fitness and supplements theme.', status: 'active', categories: ['Health', 'Sports'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'urban': { id: 'urban', name: 'Urban', slug: 'urban', folderName: 'urban', version: '1.0.0', description: 'Street fashion theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'metro': { id: 'metro', name: 'Metro', slug: 'metro', folderName: 'metro', version: '1.0.0', description: 'City fashion theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'chic': { id: 'chic', name: 'Chic', slug: 'chic', folderName: 'chic', version: '1.0.0', description: 'Elegant clothing theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'vogue': { id: 'vogue', name: 'Vogue', slug: 'vogue', folderName: 'vogue', version: '1.0.0', description: 'High fashion theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'trend': { id: 'trend', name: 'Trend', slug: 'trend', folderName: 'trend', version: '1.0.0', description: 'Trendy fashion theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'style': { id: 'style', name: 'Style', slug: 'style', folderName: 'style', version: '1.0.0', description: 'Stylish clothing theme.', status: 'active', categories: ['Fashion'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'bloom': { id: 'bloom', name: 'Bloom', slug: 'bloom', folderName: 'bloom', version: '1.0.0', description: 'Floral theme.', status: 'active', categories: ['Plants'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'flora': { id: 'flora', name: 'Flora', slug: 'flora', folderName: 'flora', version: '1.0.0', description: 'Plant shop theme.', status: 'active', categories: ['Plants'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'botanica': { id: 'botanica', name: 'Botanica', slug: 'botanica', folderName: 'botanica', version: '1.0.0', description: 'Botanical theme.', status: 'active', categories: ['Plants'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'sprout': { id: 'sprout', name: 'Sprout', slug: 'sprout', folderName: 'sprout', version: '1.0.0', description: 'Nursery theme.', status: 'active', categories: ['Plants'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'nest': { id: 'nest', name: 'Nest', slug: 'nest', folderName: 'nest', version: '1.0.0', description: 'Home decor theme.', status: 'active', categories: ['Interior'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'haven': { id: 'haven', name: 'Haven', slug: 'haven', folderName: 'haven', version: '1.0.0', description: 'Comfortable living theme.', status: 'active', categories: ['Interior'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'abode': { id: 'abode', name: 'Abode', slug: 'abode', folderName: 'abode', version: '1.0.0', description: 'Housing theme.', status: 'active', categories: ['Interior'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'casa': { id: 'casa', name: 'Casa', slug: 'casa', folderName: 'casa', version: '1.0.0', description: 'Modern home theme.', status: 'active', categories: ['Interior'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'dwell': { id: 'dwell', name: 'Dwell', slug: 'dwell', folderName: 'dwell', version: '1.0.0', description: 'Apartment living theme.', status: 'active', categories: ['Interior'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'gadget': { id: 'gadget', name: 'Gadget', slug: 'gadget', folderName: 'gadget', version: '1.0.0', description: 'Tech gadget theme.', status: 'active', categories: ['Electronics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'gizmo': { id: 'gizmo', name: 'Gizmo', slug: 'gizmo', folderName: 'gizmo', version: '1.0.0', description: 'Tech gizmo theme.', status: 'active', categories: ['Electronics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'wire': { id: 'wire', name: 'Wire', slug: 'wire', folderName: 'wire', version: '1.0.0', description: 'Electronics wire theme.', status: 'active', categories: ['Electronics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'circuit': { id: 'circuit', name: 'Circuit', slug: 'circuit', folderName: 'circuit', version: '1.0.0', description: 'Electronics circuit theme.', status: 'active', categories: ['Electronics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'volt': { id: 'volt', name: 'Volt', slug: 'volt', folderName: 'volt', version: '1.0.0', description: 'Electronics volt theme.', status: 'active', categories: ['Electronics'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'pantry': { id: 'pantry', name: 'Pantry', slug: 'pantry', folderName: 'pantry', version: '1.0.0', description: 'Grocery pantry theme.', status: 'active', categories: ['Grocery'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'harvest': { id: 'harvest', name: 'Harvest', slug: 'harvest', folderName: 'harvest', version: '1.0.0', description: 'Grocery harvest theme.', status: 'active', categories: ['Grocery'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'bites': { id: 'bites', name: 'Bites', slug: 'bites', folderName: 'bites', version: '1.0.0', description: 'Snack bites theme.', status: 'active', categories: ['Food'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'nibble': { id: 'nibble', name: 'Nibble', slug: 'nibble', folderName: 'nibble', version: '1.0.0', description: 'Snack nibble theme.', status: 'active', categories: ['Food'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'feast': { id: 'feast', name: 'Feast', slug: 'feast', folderName: 'feast', version: '1.0.0', description: 'Food feast theme.', status: 'active', categories: ['Food'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'sweat': { id: 'sweat', name: 'Sweat', slug: 'sweat', folderName: 'sweat', version: '1.0.0', description: 'Fitness sweat theme.', status: 'active', categories: ['Fitness'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'iron': { id: 'iron', name: 'Iron', slug: 'iron', folderName: 'iron', version: '1.0.0', description: 'Fitness iron theme.', status: 'active', categories: ['Fitness'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'pump': { id: 'pump', name: 'Pump', slug: 'pump', folderName: 'pump', version: '1.0.0', description: 'Fitness pump theme.', status: 'active', categories: ['Fitness'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'stride': { id: 'stride', name: 'Stride', slug: 'stride', folderName: 'stride', version: '1.0.0', description: 'Running stride theme.', status: 'active', categories: ['Sports'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'dash': { id: 'dash', name: 'Dash', slug: 'dash', folderName: 'dash', version: '1.0.0', description: 'Running dash theme.', status: 'active', categories: ['Sports'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'wheels': { id: 'wheels', name: 'Wheels', slug: 'wheels', folderName: 'wheels', version: '1.0.0', description: 'Auto wheels theme.', status: 'active', categories: ['Automotive'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'drive': { id: 'drive', name: 'Drive', slug: 'drive', folderName: 'drive', version: '1.0.0', description: 'Auto drive theme.', status: 'active', categories: ['Automotive'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'motor': { id: 'motor', name: 'Motor', slug: 'motor', folderName: 'motor', version: '1.0.0', description: 'Auto motor theme.', status: 'active', categories: ['Automotive'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'speed': { id: 'speed', name: 'Speed', slug: 'speed', folderName: 'speed', version: '1.0.0', description: 'Auto speed theme.', status: 'active', categories: ['Automotive'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'race': { id: 'race', name: 'Race', slug: 'race', folderName: 'race', version: '1.0.0', description: 'Auto race theme.', status: 'active', categories: ['Automotive'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'tots': { id: 'tots', name: 'Tots', slug: 'tots', folderName: 'tots', version: '1.0.0', description: 'Kids tots theme.', status: 'active', categories: ['Kids'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'sprouts': { id: 'sprouts', name: 'Sprouts', slug: 'sprouts', folderName: 'sprouts', version: '1.0.0', description: 'Kids sprouts theme.', status: 'active', categories: ['Kids'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'cub': { id: 'cub', name: 'Cub', slug: 'cub', folderName: 'cub', version: '1.0.0', description: 'Kids cub theme.', status: 'active', categories: ['Kids'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'mini': { id: 'mini', name: 'Mini', slug: 'mini', folderName: 'mini', version: '1.0.0', description: 'Kids mini theme.', status: 'active', categories: ['Kids'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'tiny': { id: 'tiny', name: 'Tiny', slug: 'tiny', folderName: 'tiny', version: '1.0.0', description: 'Kids tiny theme.', status: 'active', categories: ['Kids'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'canvas': { id: 'canvas', name: 'Canvas', slug: 'canvas', folderName: 'canvas', version: '1.0.0', description: 'Art canvas theme.', status: 'active', categories: ['Art'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'palette': { id: 'palette', name: 'Palette', slug: 'palette', folderName: 'palette', version: '1.0.0', description: 'Art palette theme.', status: 'active', categories: ['Art'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'muse': { id: 'muse', name: 'Muse', slug: 'muse', folderName: 'muse', version: '1.0.0', description: 'Art muse theme.', status: 'active', categories: ['Art'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'indie': { id: 'indie', name: 'Indie', slug: 'indie', folderName: 'indie', version: '1.0.0', description: 'Art indie theme.', status: 'active', categories: ['Art'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'maker': { id: 'maker', name: 'Maker', slug: 'maker', folderName: 'maker', version: '1.0.0', description: 'Art maker theme.', status: 'active', categories: ['Art'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'epic': { id: 'epic', name: 'Epic', slug: 'epic', folderName: 'epic', version: '1.0.0', description: 'Multipurpose epic theme.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'apex': { id: 'apex', name: 'Apex', slug: 'apex', folderName: 'apex', version: '1.0.0', description: 'Multipurpose apex theme.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'zenith': { id: 'zenith', name: 'Zenith', slug: 'zenith', folderName: 'zenith', version: '1.0.0', description: 'Multipurpose zenith theme.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'summit': { id: 'summit', name: 'Summit', slug: 'summit', folderName: 'summit', version: '1.0.0', description: 'Multipurpose summit theme.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'peak': { id: 'peak', name: 'Peak', slug: 'peak', folderName: 'peak', version: '1.0.0', description: 'Multipurpose peak theme.', status: 'active', categories: ['Multipurpose'], previewUrl: '', demoUrl: '', supportedPages: ['home', 'shop', 'product', 'cart'], supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [], designTokens: {}, typography: {}, colors: {}, layout: {}, responsiveConfig: {}, componentMappings: {}, pageMappings: {}, cmsMappings: {}, featureFlags: {} },
  'moduva': {
    id: 'moduva',
    name: 'Moduva',
    slug: 'moduva',
    folderName: 'moduva',
    version: '1.0.0',
    description: 'Minimal fashion theme.',
    status: 'active',
    categories: ['Fashion'],
    previewUrl: '/previews/moduva.png', demoUrl: '',
    supportedPages: ['home', 'shop', 'product', 'cart'],
    supportedComponents: ['header', 'footer', 'product-card'], supportedSections: ['hero'], features: [],
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
