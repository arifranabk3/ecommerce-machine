import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { resolveStorefront, StoreContext } from '@/storefront';
import { getThemeConfig, ThemeConfig } from '../../../themes';

// Type for the dynamic props
type Props = {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Dynamic mapping of known basic components
// Note: We use dynamic imports with template literals to support infinite themes.
// However, Next.js dynamic() requires the static path pattern to be analyzable by webpack.
// To bypass webpack statically analyzing everything, we dynamically resolve inside a try/catch
// or use a structured registry. Because this is the foundational engine, we'll implement
// a secure dynamic resolver function.

export default async function ThemePage({ params, searchParams }: Props) {
  const isPreview = searchParams.preview === 'true';

  // 1. Resolve Store (Domain -> Tenant)
  const store = await resolveStorefront(undefined, isPreview);
  
  // 2. Load Theme Config
  const theme = getThemeConfig(store.themeId);
  
  if (!theme || theme.status === 'deprecated') {
    return notFound();
  }

  // 3. Determine Route Path
  // If no slug, it's the home page.
  const path = params.slug ? params.slug.join('/') : 'home';

  // 4. Validate if theme supports this page
  if (!theme.supportedPages.includes(path)) {
    return notFound();
  }

  // 5. Dynamic Code-Splitting Import 
  // We use a React Server Component generic wrapper that requires the dynamic component
  try {
    // Webpack requires *some* hardcoded structure to know what chunks to generate.
    // By using `../../themes/${theme.folderName}/pages/${path}`, webpack creates a context map
    // restricted strictly to the themes directory.
    const ThemePageComponent = dynamic<{ store: StoreContext; themeConfig: ThemeConfig }>(
      () => import(`../../../themes/${theme.folderName}/pages/${path}`).catch(() => {
        return notFound();
      }),
      { 
        loading: () => <div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div></div> 
      }
    );

    return <ThemePageComponent store={store} themeConfig={theme} />;
  } catch {
    return notFound();
  }
}
