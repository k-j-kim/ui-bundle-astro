import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import salesforce from '@salesforce/vite-plugin-ui-bundle';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// UI Bundle expectations:
//  - Build output must land at ./dist (matches `outputDir` in ui-bundle.json).
//  - Assets must load via relative paths; Salesforce serves the bundle at a
//    dynamic base path exposed on `globalThis.SFDC_ENV.basePath`.
//  - SPA-style fallback to index.html (handled in scripts/postbuild.mjs).
export default defineConfig({
  output: 'static',
  outDir: './dist',
  build: {
    assets: 'assets',
    // Emit `dist/accounts.html` instead of `dist/accounts/index.html`. The UI
    // Bundle runtime (`trailingSlash: never` in ui-bundle.json) serves routes
    // as `<name>.html`; directory-style URLs fall through to the SPA fallback
    // and render the wrong page.
    format: 'file',
  },
  // Astro emits absolute `/assets/...` URLs. `@salesforce/vite-plugin-ui-bundle`
  // rewrites them at runtime to the dynamic mount path (same mechanism the
  // React template relies on via `base: './'`; MPA output prefers absolute).
  trailingSlash: 'never',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), salesforce()],
    resolve: {
      alias: {
        '@': r('./src'),
        '@components': r('./src/components'),
        '@layouts': r('./src/layouts'),
        '@lib': r('./src/lib'),
        '@styles': r('./src/styles'),
      },
    },
  },
});
