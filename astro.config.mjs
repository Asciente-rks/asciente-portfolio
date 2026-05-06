import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://asciente-portfolio.vercel.app',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [tailwind()],
  markdown: {
    syntaxHighlight: 'shiki',
  },
});
