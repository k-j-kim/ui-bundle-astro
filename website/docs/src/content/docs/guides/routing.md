---
title: Routing
description: How Astro's file-based pages map to UI Bundle URLs.
---

Astro replaces `react-router` in Puebla. Every file in `src/pages/` becomes
a static `.html` file at build time.

## Static routes

```text
src/pages/index.astro      → /
src/pages/accounts.astro   → /accounts
src/pages/contacts.astro   → /contacts
src/pages/about.astro      → /about
```

Note that we use `format: 'file'` in `astro.config.mjs`, so routes emit
as `accounts.html` (not `accounts/index.html`). The UI Bundle runtime
serves these directly; deep links fall back to `index.html`.

## Dynamic routes

Astro supports `[param].astro` for dynamic segments — but because the
output is static, the params must be enumerable at build time:

```astro
---
// src/pages/accounts/[id].astro
export async function getStaticPaths() {
  return [{ params: { id: '001xx' } }, { params: { id: '001yy' } }];
}
const { id } = Astro.params;
---
<h1>Account {id}</h1>
```

For runtime-driven detail pages, prefer a single page that reads the ID
from the URL (e.g., `?id=...`) and fetches data via the SDK in a React
island.

## Navigation

Use plain `<a href="/accounts">` for in-app links. Wrap with `withBase()`
if you want to prefix the bundle's mount path:

```ts
import { withBase } from '@lib/utils';

<a href={withBase('/accounts')}>Accounts</a>
```

`withBase` reads `globalThis.SFDC_ENV.basePath` at runtime so links
resolve correctly under Salesforce's dynamic mount path.

## 404 page

Place `src/pages/404.astro`. The UI Bundle runtime serves it on missing
routes (after the SPA fallback chain).

## Active link state

Astro components have access to `Astro.url.pathname`, so you can compute
active state without `useLocation`:

```astro
---
const path = Astro.url.pathname;
---
<a href="/accounts" aria-current={path === '/accounts' ? 'page' : undefined}>
  Accounts
</a>
```
