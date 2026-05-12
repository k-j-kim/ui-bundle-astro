---
title: Pages & routing
description: File-based routing, navigation, dynamic routes, and 404 handling.
---

Every `.astro` file in `src/pages/` becomes a route. No router config needed.

## Static routes

```text
src/pages/index.astro         →  /           (dist/index.html)
src/pages/accounts.astro      →  /accounts   (dist/accounts.html)
src/pages/contacts.astro      →  /contacts   (dist/contacts.html)
```

A minimal page:

```astro
---
// src/pages/settings.astro
import AppLayout from '@layouts/AppLayout.astro';
---
<AppLayout title="Settings" heading="Settings">
  <p>Your content here.</p>
</AppLayout>
```

Drop this file in `src/pages/` and `/settings` is immediately available.

## Layout

All pages share `AppLayout.astro`, which provides the HTML shell, navigation bar, and footer:

```astro
---
// src/layouts/AppLayout.astro
import '@styles/global.css';
import NavBar from '@components/NavBar.astro';

interface Props {
  title?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}
const { title = 'Astro UI Bundle', eyebrow, heading, subheading } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body class="min-h-screen text-slate-900 antialiased">
    <NavBar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {heading && (
        <header class="mb-8">
          {eyebrow && <p class="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">{eyebrow}</p>}
          <h1 class="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight">{heading}</h1>
          {subheading && <p class="mt-2 text-slate-600 max-w-2xl">{subheading}</p>}
        </header>
      )}
      <slot />
    </main>
  </body>
</html>
```

## Navigation with `withBase()`

Salesforce serves UI Bundles under a dynamic mount path (e.g. `/lwr/application/ai/c-MyApp`). Plain `<a href="/accounts">` won't work. Use `withBase()`:

```astro
---
import { withBase } from '@lib/utils';
---
<a href={withBase('/accounts')}>Accounts</a>
```

`withBase()` reads the mount path from `globalThis.SFDC_ENV.basePath` and prepends it:

```ts
// src/lib/utils.ts
export function getBasePath(): string {
  const raw = globalThis.SFDC_ENV?.basePath;
  return typeof raw === 'string' ? raw.replace(/\/+$/, '') : '';
}

export function withBase(path: string): string {
  const base = getBasePath();
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}
```

During local dev, `SFDC_ENV` is undefined, so `withBase('/accounts')` returns `/accounts`. On Salesforce, it returns `/lwr/application/ai/c-MyApp/accounts`.

## Active link detection

The `NavBar` component highlights the current page:

```astro
---
const current = Astro.url.pathname.replace(/\/+$/, '') || '/';
---
{items.map(item => {
  const active = current === item.href
    || (item.href !== '/' && current.startsWith(item.href));
  return (
    <a
      href={withBase(item.href)}
      class:list={[
        'px-3 py-1.5 rounded-full font-medium transition',
        active
          ? 'bg-slate-900 text-white'
          : 'text-slate-600 hover:bg-slate-100',
      ]}
    >
      {item.label}
    </a>
  );
})}
```

## Dynamic routes

For parameterized pages (e.g. `/accounts/:id`), use Astro's bracket syntax with `getStaticPaths()`:

```astro
---
// src/pages/accounts/[id].astro
import AppLayout from '@layouts/AppLayout.astro';

export function getStaticPaths() {
  // At build time, return the set of valid IDs.
  // For UI Bundles this is typically empty — the SPA fallback
  // handles deep links at runtime.
  return [];
}

const { id } = Astro.params;
---
<AppLayout title={`Account ${id}`} heading={`Account ${id}`}>
  <p>Detail view for account {id}.</p>
</AppLayout>
```

In practice, most UI Bundle apps rely on the SPA fallback (`index.html`) for detail routes and handle routing client-side with a React island.

## 404 page

```astro
---
// src/pages/404.astro
import AppLayout from '@layouts/AppLayout.astro';
import { withBase } from '@lib/utils';
---
<AppLayout title="Not found" heading="404">
  <p>Page not found. <a href={withBase('/')}>Back to dashboard</a>.</p>
</AppLayout>
```

Salesforce serves `index.html` for unmatched paths (via `spaFallback` in `ui-bundle.json`). The 404 page is a safety net for static builds.
