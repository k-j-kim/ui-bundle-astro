---
title: FAQ
description: Answers to common questions about the ui-bundle-astro template.
---

## Why Astro instead of a React SPA?

Astro renders pages to static HTML at build time. JavaScript is only shipped for components that need interactivity (React islands). For a typical UI Bundle with 5-6 pages and 1-2 interactive tables, this means most pages load with zero JS.

The React-based UI Bundle template ships the full React runtime and router to every page. Astro lets you choose per-component whether JS is needed.

## Why `build.format: 'file'` instead of `'directory'`?

The UI Bundle runtime serves routes as `<name>.html` and falls back to `index.html` for unmatched paths. With directory-style URLs (`accounts/index.html`), the runtime triggers the SPA fallback and renders the wrong page.

```js
// astro.config.mjs
build: {
  format: 'file',  // emits accounts.html, not accounts/index.html
},
```

## What does the post-build script do?

`scripts/postbuild.mjs` runs three transforms after `astro build`:

1. **URL rewriting** — converts absolute URLs (`/assets/main.css`) to relative paths (`./assets/main.css`) so they resolve under the dynamic Salesforce mount path.
2. **Script externalization** — extracts inline `<script>` tags to separate `.js` files because Salesforce's CSP blocks inline scripts.
3. **Fallback validation** — checks that `dist/index.html` exists, which `spaFallback` in `ui-bundle.json` requires.

## How does `withBase()` work?

Salesforce serves your bundle under a dynamic mount path like `/lwr/application/ai/c-MyApp`. The runtime sets `globalThis.SFDC_ENV.basePath` before your JS runs. The `withBase()` helper prefixes in-app links with it:

```ts
// src/lib/utils.ts
export function getBasePath(): string {
  return globalThis.SFDC_ENV?.basePath?.replace(/\/+$/, '') ?? '';
}

export function withBase(path: string): string {
  return `${getBasePath()}${path.startsWith('/') ? '' : '/'}${path}`;
}
```

Use it in navigation:

```astro
<a href={withBase('/accounts')}>Accounts</a>
```

Asset URLs (`/assets/*.js`, `/assets/*.css`) are handled separately by the `@salesforce/vite-plugin-ui-bundle` Vite plugin and the post-build script.

## Can I use React Router?

Yes. Create a catch-all page `src/pages/[...all].astro` and let React Router handle routing inside it:

```astro
---
import AppLayout from '@layouts/AppLayout.astro';
import App from '@components/App.tsx';

export function getStaticPaths() {
  return [{ params: { all: undefined } }];
}
---
<AppLayout title="App">
  <App client:only="react" />
</AppLayout>
```

You'll lose Astro's per-page static rendering — every route ships the full React runtime. Consider whether file-based routing is sufficient first.

## How do I add a new page?

Create a `.astro` file in `src/pages/`:

```astro
---
// src/pages/leads.astro
import AppLayout from '@layouts/AppLayout.astro';
import Card from '@components/Card.astro';
import RecordList from '@components/RecordList.tsx';
---
<AppLayout title="Leads" eyebrow="Sales" heading="Leads">
  <Card title="All leads">
    <RecordList
      client:load
      sobject="Lead"
      columns={[
        { label: 'Name',    field: 'Name' },
        { label: 'Company', field: 'Company', muted: true },
        { label: 'Status',  field: 'Status',  muted: true },
      ]}
    />
  </Card>
</AppLayout>
```

Then add a nav link in `NavBar.astro`:

```astro
const links = [
  { label: 'Dashboard', href: withBase('/') },
  { label: 'Accounts', href: withBase('/accounts') },
  { label: 'Contacts', href: withBase('/contacts') },
  { label: 'Leads', href: withBase('/leads') },       // new
];
```

## Can I query records during local development?

No. During `npm run dev`, the Salesforce Data SDK isn't connected to a real org. Calls to `runQuery()` will fail with "DataSDK.graphql is not available on this surface".

To test with live data:

1. `npm run build`
2. `sf project deploy start --source-dir force-app/main/default/uiBundles --target-org my-org`
3. Open the bundle in your org

## Does the template support GraphQL codegen?

Not out of the box. You can add `@graphql-codegen/cli` and a codegen config to generate typed query helpers from your GraphQL operations.

## How do I customize the theme colors?

Edit the `@theme` block in `src/styles/global.css`:

```css
@theme {
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-900: #312e81;
}
```

These become Tailwind utilities: `bg-brand-500`, `text-brand-700`, etc. No `tailwind.config.js` needed — Tailwind v4 uses CSS-native configuration.

## What Salesforce API version should I use?

Match the `apiVersion` in your `*.uibundle-meta.xml` to your org:

```xml
<UiBundle xmlns="http://soap.sforce.com/2006/04/metadata">
  <apiVersion>63.0</apiVersion>
  <isActive>true</isActive>
  <masterLabel>MyApp</masterLabel>
</UiBundle>
```

## What files get deployed to Salesforce?

Only `dist/`, `ui-bundle.json`, and `*.uibundle-meta.xml`. Everything else is excluded by `.forceignore`:

```text
node_modules/
src/
scripts/
*.ts
*.tsx
*.mjs
package.json
package-lock.json
tsconfig.json
```

## How do I report a bug?

Open an issue on [GitHub](https://github.com/k-j-kim/ui-bundle-astro/issues).
