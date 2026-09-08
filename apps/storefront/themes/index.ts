/**
 * Theme Registry
 * 
 * This directory holds individual themes.
 * Do not create generic fake theme folders. Every future theme will use its proper theme-name folder.
 */

export interface ThemeConfig {
  id: string;
  name: string;
  version: string;
  author: string;
}

export const themes: Record<string, ThemeConfig> = {};
