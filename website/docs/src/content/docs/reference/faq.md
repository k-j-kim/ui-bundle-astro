---
title: FAQ
description: Common questions about Puebla.
---

## Why Astro instead of React + Vite?

Astro renders pages to static HTML and only ships JS for interactive
islands. For most UI Bundle apps that's a smaller payload and faster
first paint than a SPA.

## Can I still use `react-router`?

Yes — drop a `[...all].astro` page and let `react-router` handle routing
inside it. But you'll lose the page-level static rendering benefits, so
consider whether file-based routing fits first.

## How does `globalThis.SFDC_ENV.basePath` work?

Salesforce sets it before your bundle's JS runs. Use the `withBase()`
helper to prefix in-app links with it. Asset URLs are rewritten by
`@salesforce/vite-plugin-ui-bundle` automatically.

## Does it support GraphQL codegen?

Not by default — add `vite-plugin-graphql-codegen` to
`astro.config.mjs` to wire it up.

## Why `format: 'file'` and not directory-style URLs?

The UI Bundle runtime serves routes as `<name>.html` and falls back to
`index.html` for missing paths. Directory-style URLs
(`accounts/index.html`) trigger the SPA fallback and render the wrong
page.

## How do I add a new route?

Drop a new `.astro` file in `src/pages/` and link to it. No router
config needed.

## Is design mode (`vite --mode design`) supported?

Not yet. Add a `dev:design` npm script if you need it; the React
template can be a reference.

## How do I report a bug?

Open an issue on [GitHub](https://github.com/puebla/puebla/issues). Include
your Node version, OS, and the Salesforce API version from
`sfdx-project.json`.
