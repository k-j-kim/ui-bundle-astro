---
title: Project structure
description: Every file in a scaffolded project, explained.
---

```text
MyApp/
├── astro.config.mjs          # Astro + React + Tailwind + Salesforce plugin
├── env.d.ts                  # Type declarations for SFDC_ENV
├── package.json
├── tsconfig.json
├── ui-bundle.json            # Salesforce UI Bundle config
├── MyApp.uibundle-meta.xml   # Salesforce metadata
├── scripts/
│   └── postbuild.mjs         # URL rewriting + CSP compliance
└── src/
    ├── pages/                # File-based routes → one .html per page
    │   ├── index.astro       # Dashboard
    │   ├── accounts.astro
    │   ├── contacts.astro
    │   ├── opportunities.astro
    │   ├── about.astro
    │   └── 404.astro
    ├── layouts/
    │   └── AppLayout.astro   # Shared HTML shell, nav, footer
    ├── components/
    │   ├── NavBar.astro      # Sticky header with active-link detection
    │   ├── Card.astro        # Container with title/subtitle
    │   ├── StatTile.astro    # Metric display with trend indicator
    │   └── RecordList.tsx    # React island — data table via GraphQL
    ├── lib/
    │   ├── sdk.ts            # Shared DataSDK instance + runQuery()
    │   └── utils.ts          # cn(), withBase(), getBasePath()
    └── styles/
        └── global.css        # Tailwind entry + design tokens
```

## Config files

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import salesforce from '@salesforce/vite-plugin-ui-bundle';

export default defineConfig({
  output: 'static',
  outDir: './dist',
  build: { format: 'file', assets: 'assets' },
  trailingSlash: 'never',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), salesforce()],
    resolve: {
      alias: {
        '@components': './src/components',
        '@layouts':    './src/layouts',
        '@lib':        './src/lib',
        '@styles':     './src/styles',
      },
    },
  },
});
```

Key settings:

- **`format: 'file'`** — emits `dist/accounts.html` instead of `dist/accounts/index.html`. The UI Bundle runtime expects this; directory-style URLs fall through to the SPA fallback and render the wrong page.
- **`trailingSlash: 'never'`** — matches `ui-bundle.json`.
- **`salesforce()`** — rewrites `/assets/...` URLs to the runtime mount path.

### `ui-bundle.json`

```json
{
  "outputDir": "dist",
  "spaFallback": "index.html",
  "trailingSlash": "never"
}
```

- `outputDir` — where the build output lives.
- `spaFallback` — Salesforce serves this for any unmatched path (deep-link support).
- `trailingSlash` — must match `astro.config.mjs`.

### `env.d.ts`

```ts
declare global {
  interface SfdcEnv {
    basePath?: string;
  }
  var SFDC_ENV: SfdcEnv | undefined;
}
export {};
```

The Salesforce runtime injects `globalThis.SFDC_ENV.basePath` before your JS runs. This is the mount path (e.g. `/lwr/application/ai/c-MyApp`). The `withBase()` helper in `src/lib/utils.ts` uses it.

### `scripts/postbuild.mjs`

Runs after `astro build`. Handles three things:

1. **URL rewriting** — converts absolute `/assets/...` and `/contacts` references to relative paths (`./assets/...`, `./contacts`), because the bundle is served under a dynamic mount path.
2. **Script externalization** — moves inline `<script>` content to separate `.js` files. Salesforce's CSP blocks inline scripts.
3. **Fallback validation** — checks that `dist/index.html` exists so SPA-style deep links work.

## Source code

### `src/pages/`

Each `.astro` file becomes a route. `index.astro` → `/`, `accounts.astro` → `/accounts`. See [Routing](/guides/routing/).

### `src/components/`

Mix `.astro` (zero-JS, server-rendered) and `.tsx` (React island) components. The bundler only ships JS for islands. See [React islands](/guides/islands/).

### `src/lib/`

Shared utilities. `sdk.ts` exports the DataSDK instance. `utils.ts` has `cn()` for class merging and `withBase()` for links. See [Querying data](/guides/data/).

### `src/styles/global.css`

Tailwind v4 entry with custom design tokens. Imported once from `AppLayout.astro`. See [Styling](/guides/styling/).
