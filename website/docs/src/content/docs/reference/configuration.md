---
title: Configuration
description: Every config file in a Puebla bundle, annotated.
---

## `ui-bundle.json`

```json
{
  "outputDir": "dist",
  "spaFallback": "index.html",
  "trailingSlash": "never"
}
```

| Field | Description |
| --- | --- |
| `outputDir` | Directory deployed to Salesforce. Must match Astro's `outDir`. |
| `spaFallback` | File to serve for unknown routes. |
| `trailingSlash` | `never` matches Astro's `format: 'file'` output. |

## `astro.config.mjs`

```js
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
        '@': r('./src'),
        '@components': r('./src/components'),
        '@layouts': r('./src/layouts'),
        '@lib': r('./src/lib'),
        '@styles': r('./src/styles'),
      },
    },
  },
});
```

| Option | Why |
| --- | --- |
| `output: 'static'` | UI Bundles are static assets. |
| `format: 'file'` | Emits `accounts.html` rather than `accounts/index.html`. |
| `trailingSlash: 'never'` | Mirrors `ui-bundle.json`. |
| `vite.plugins.salesforce()` | Rewrites `/assets/...` URLs to the runtime mount path. |

## `tsconfig.json`

Strict TypeScript. Inherits from `astro/tsconfigs/strict`. Path aliases
mirror those in `astro.config.mjs`.

## `MyApp.uibundle-meta.xml`

Standard Salesforce metadata. Toggle the bundle on/off via `<active>`.

```xml
<UIBundle xmlns="http://soap.sforce.com/2006/04/metadata">
  <label>My App</label>
  <active>true</active>
</UIBundle>
```

## `.forceignore`

Ships in the project root. Keeps Astro source out of the deploy:

```text
**/uiBundles/**/node_modules/**
**/uiBundles/**/src/**
**/uiBundles/**/scripts/**
**/uiBundles/**/package.json
**/uiBundles/**/astro.config.mjs
**/uiBundles/**/tsconfig.json
```
