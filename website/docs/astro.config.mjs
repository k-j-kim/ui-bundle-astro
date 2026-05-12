import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const isProd = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isProd
    ? 'https://k-j-kim.github.io'
    : 'http://localhost:4322',
  base: isProd ? '/ui-bundle-astro-docs/' : '/',
  integrations: [
    starlight({
      title: 'ui-bundle-astro',
      description: 'Astro template for Salesforce UI Bundles',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/k-j-kim/ui-bundle-astro',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/k-j-kim/ui-bundle-astro-docs/edit/master/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', slug: 'introduction' },
            { label: 'Getting started', slug: 'getting-started' },
            { label: 'Project structure', slug: 'project-structure' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Routing', slug: 'guides/routing' },
            { label: 'React islands', slug: 'guides/islands' },
            { label: 'Styling with Tailwind', slug: 'guides/styling' },
            { label: 'Data with the SDK', slug: 'guides/data' },
            { label: 'Deploying', slug: 'guides/deploying' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Configuration', slug: 'reference/configuration' },
            { label: 'CLI commands', slug: 'reference/cli' },
            { label: 'FAQ', slug: 'reference/faq' },
          ],
        },
      ],
      expressiveCode: {
        themes: ['github-dark'],
        styleOverrides: {
          borderRadius: '12px',
          frames: {
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
      },
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#07080b' },
        },
      ],
    }),
  ],
});
