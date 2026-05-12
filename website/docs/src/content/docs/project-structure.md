---
title: Project structure
description: A tour of every file in a ui-bundle-astro bundle.
---

A fresh ui-bundle-astro bundle looks like this:

```text
MyApp/
├── ui-bundle.json                    # UI Bundle config (outputDir, fallback)
├── MyApp.uibundle-meta.xml           # Salesforce metadata (label, version)
├── astro.config.mjs                  # Astro + integrations
├── tsconfig.json
├── package.json
├── env.d.ts
├── scripts/
│   └── postbuild.mjs                 # Verifies dist/index.html exists
└── src/
    ├── pages/                        # File-based routes
    │   ├── index.astro
    │   ├── accounts.astro
    │   └── 404.astro
    ├── components/
    │   ├── Card.astro                # Static (zero-JS)
    │   ├── NavBar.astro
    │   └── RecordList.tsx            # React island
    ├── layouts/
    │   └── AppLayout.astro
    ├── lib/
    │   ├── sdk.ts                    # Shared createDataSDK() instance
    │   └── utils.ts                  # cn(), withBase()
    └── styles/
        └── global.css                # Tailwind entry
```

## Config files

### `ui-bundle.json`

Tells the UI Bundle runtime where the build output lives and how to
handle deep-link fallback.

```json
{
  "outputDir": "dist",
  "spaFallback": "index.html",
  "trailingSlash": "never"
}
```

### `MyApp.uibundle-meta.xml`

Standard Salesforce metadata. Controls the label, API version, and
active flag.

### `astro.config.mjs`

Configures Astro with `output: 'static'`, the React integration,
Tailwind, and the Salesforce Vite plugin.

```js
export default defineConfig({
  output: 'static',
  outDir: './dist',
  build: { format: 'file', assets: 'assets' },
  trailingSlash: 'never',
  integrations: [react()],
  vite: { plugins: [tailwindcss(), salesforce()] },
});
```

The `format: 'file'` flag is important — it produces
`dist/accounts.html` rather than `dist/accounts/index.html`, which is
what the UI Bundle runtime expects.

## Source layout

### `src/pages/`

Each `.astro` file becomes a route. `index.astro` is `/`, `accounts.astro`
is `/accounts`, and so on. See [Routing](/guides/routing/).

### `src/components/`

Mix `.astro` (zero-JS, server-rendered) and `.tsx` (React island)
components freely. The bundler only ships JS for islands.

### `src/lib/`

Shared utilities. `sdk.ts` exports a singleton `createDataSDK()` used by
React islands. `utils.ts` contains `cn()` and `withBase()` helpers.

### `src/styles/global.css`

Tailwind v4 entry point. Imported once from `AppLayout.astro`.

## Build artifacts

After `npm run build`:

```text
dist/
├── index.html
├── accounts.html
├── 404.html
└── assets/
    ├── *.js
    └── *.css
```

The `@salesforce/vite-plugin-ui-bundle` plugin rewrites `/assets/...`
URLs at runtime to the dynamic mount path Salesforce serves the bundle
under.
