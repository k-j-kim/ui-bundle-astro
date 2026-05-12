import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isProd = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isProd
    ? 'https://k-j-kim.github.io'
    : 'http://localhost:4321',
  base: isProd ? '/ui-bundle-astro/' : '/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
