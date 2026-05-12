---
title: Configuration reference
description: Every config file, annotated.
---

## `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import salesforce from '@salesforce/vite-plugin-ui-bundle';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  output: 'static',
  outDir: './dist',
  build: {
    assets: 'assets',
    format: 'file',
  },
  trailingSlash: 'never',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), salesforce()],
    resolve: {
      alias: {
        '@':           r('./src'),
        '@components': r('./src/components'),
        '@layouts':    r('./src/layouts'),
        '@lib':        r('./src/lib'),
        '@styles':     r('./src/styles'),
      },
    },
  },
});
```

| Option | Value | Why |
|---|---|---|
| `output` | `'static'` | All pages are pre-rendered to HTML. |
| `outDir` | `'./dist'` | Matches `outputDir` in `ui-bundle.json`. |
| `build.format` | `'file'` | Emits `accounts.html` not `accounts/index.html`. The UI Bundle runtime requires this. |
| `build.assets` | `'assets'` | Asset output directory inside `dist/`. |
| `trailingSlash` | `'never'` | Must match `ui-bundle.json`. |
| `integrations` | `[react()]` | Enables React island hydration. |
| `tailwindcss()` | Vite plugin | Tailwind v4 — no separate config file needed. |
| `salesforce()` | Vite plugin | Rewrites asset URLs for the dynamic Salesforce mount path. |
| `alias` | `@components`, etc. | Path aliases for clean imports. |

## `ui-bundle.json`

```json
{
  "outputDir": "dist",
  "spaFallback": "index.html",
  "trailingSlash": "never"
}
```

| Field | Description |
|---|---|
| `outputDir` | Directory containing the build output. |
| `spaFallback` | Salesforce serves this file for any unmatched route. Enables deep-link support. |
| `trailingSlash` | `"never"` — routes are `/accounts` not `/accounts/`. Must match `astro.config.mjs`. |

## `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*":           ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*":    ["src/layouts/*"],
      "@lib/*":        ["src/lib/*"],
      "@styles/*":     ["src/styles/*"]
    }
  }
}
```

`astro/tsconfigs/strict` enables strict TypeScript. The `paths` must mirror the `alias` config in `astro.config.mjs`.

## `env.d.ts`

```ts
/// <reference types="astro/client" />

declare global {
  interface SfdcEnv {
    basePath?: string;
  }
  var SFDC_ENV: SfdcEnv | undefined;
}

export {};
```

Declares the `SFDC_ENV` global that the Salesforce runtime injects. `basePath` is the mount path (e.g. `/lwr/application/ai/c-MyApp`).

## `MyApp.uibundle-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<UiBundle xmlns="http://soap.sforce.com/2006/04/metadata">
  <apiVersion>63.0</apiVersion>
  <isActive>true</isActive>
  <masterLabel>MyApp</masterLabel>
</UiBundle>
```

Standard Salesforce metadata. `apiVersion` should match your org. `isActive` controls whether the bundle is accessible.

## `package.json` scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && node scripts/postbuild.mjs",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

| Script | What it does |
|---|---|
| `dev` | Starts the Astro dev server at `localhost:4321` with HMR. |
| `build` | Builds static HTML to `dist/`, then runs the post-build script for Salesforce compatibility. |
| `preview` | Serves the built `dist/` locally for testing. |
| `check` | Runs Astro's TypeScript type checker. |

## `src/styles/global.css`

```css
@import "tailwindcss";

@theme {
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-900: #312e81;
}
```

See [Styling](/guides/styling/) for details on customizing tokens.
