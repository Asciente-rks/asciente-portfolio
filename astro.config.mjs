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
    // hover (was 'viewport'): with 8+ project cards, viewport prefetch fires
    // 8+ parallel page fetches as soon as the homepage renders — including
    // the heavy SwiftRace page. `hover` waits for actual user intent so the
    // homepage scrolls smoothly and we only pay for what the user actually wants.
    defaultStrategy: 'hover',
  },
  integrations: [tailwind()],
  markdown: {
    syntaxHighlight: 'shiki',
  },
});
