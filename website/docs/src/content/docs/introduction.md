---
title: Introduction
description: What ui-bundle-astro is and how it works.
---

**ui-bundle-astro** is an [Astro](https://astro.build) template for Salesforce UI Bundles. It is a drop-in alternative to the `reactbasic` template from `sf template generate ui-bundle`.

## How it works

Astro compiles `.astro` pages to static HTML at build time. Interactive parts use React components that hydrate independently ("islands"). The result is a `dist/` folder you deploy like any other Salesforce metadata.

```
src/pages/accounts.astro  →  dist/accounts.html  (static HTML)
src/components/RecordList.tsx  →  hydrates in the browser (React island)
```

The `@salesforce/vite-plugin-ui-bundle` Vite plugin rewrites asset URLs so they resolve under whatever mount path Salesforce assigns at runtime.

## What's in the template

The scaffolded project includes:

- **6 pages** — dashboard, accounts, contacts, opportunities, about, 404
- **4 components** — `NavBar`, `Card`, `StatTile` (Astro, zero-JS), `RecordList` (React island)
- **Data SDK** — pre-wired `runQuery()` helper that calls the UI API GraphQL endpoint
- **Tailwind v4** — with `@theme` design tokens and a `cn()` class merge utility
- **Post-build script** — rewrites absolute URLs to relative paths and externalizes inline scripts for Salesforce CSP compliance

## Key differences from `reactbasic`

| | ui-bundle-astro | reactbasic |
|---|---|---|
| Output | Static `.html` per page | Single SPA bundle |
| JS shipped | Only for React islands | Entire app |
| Routing | File-based (`src/pages/`) | Client-side (`react-router`) |
| First paint | Instant (HTML) | Blocked on JS |

## Next

- [Getting started](/getting-started/) — scaffold and run in under a minute.
- [Project structure](/project-structure/) — what every file does.
