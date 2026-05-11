# Base Astro App (Salesforce UI Bundle)

An Astro-based Salesforce UI Bundle. Drop-in alternative to the `reactbasic`
template shipped by `sf template generate ui-bundle`, with Astro's file-based
routing replacing `react-router` and React used only where you need interactive
islands with `@salesforce/sdk-data`.

## Layout

| Path | Description |
| --- | --- |
| `ui-bundle.json` | UI Bundle config. `outputDir: dist`, SPA fallback to `index.html`. |
| `BaseAstroApp.uibundle-meta.xml` | UIBundle metadata (label, version, active). |
| `astro.config.mjs` | Astro config — `base: './'`, React integration, Tailwind + `@salesforce/vite-plugin-ui-bundle`. |
| `src/pages/*.astro` | File-based routes (index, accounts, 404). |
| `src/components/*.tsx` | React islands. Use `client:load` / `client:idle` to hydrate. |
| `src/components/*.astro` | Server-rendered components (zero JS). |
| `src/lib/sdk.ts` | Shared `createDataSDK()` instance. |
| `src/lib/utils.ts` | `cn()`, `withBase()` helpers. `withBase` reads `globalThis.SFDC_ENV.basePath`. |
| `scripts/postbuild.mjs` | Verifies `dist/index.html` exists (fallback requirement). |

## Run

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # → dist/
```

## Deploy

From the SFDX project root:

```bash
sf project deploy start --source-dir force-app/main/default/uiBundles --target-org <alias>
```

## Astro vs react-router (why this works)

- **Routing:** Astro's file-based pages produce `dist/<route>/index.html` per
  route. The UI Bundle runtime serves those as static assets; SPA-style deep
  links fall back to `dist/index.html` via `ui-bundle.json`.
- **Islands:** interactive components import `@salesforce/sdk-data` and are
  hydrated client-side. Everything else ships as zero-JS HTML.
- **Base path:** `base: './'` keeps hashed asset URLs relative so the bundle
  works under whatever mount path Salesforce assigns at runtime. In-app links
  use `withBase()` to prefix `globalThis.SFDC_ENV.basePath`.

## Known gaps vs the React template

- No `react-router` nav highlighting via `useLocation` — handled in
  `NavBar.astro` via `Astro.url.pathname` instead.
- No `graphql-codegen` wiring yet — add `vite-plugin-graphql-codegen` to
  `astro.config.mjs` if you want typed GraphQL.
- Design mode (`vite --mode design`) not ported; add a `dev:design` script once
  needed.
