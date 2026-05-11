---
title: Introduction
description: What Puebla is, what it isn't, and why you might want to use it.
---

**Puebla** is an [Astro](https://astro.build)-based template for
Salesforce **UI Bundles**. It is a drop-in alternative to the `reactbasic`
template shipped by `sf template generate ui-bundle`.

## At a glance

- **Static-first.** Each page in `src/pages/` is rendered to a separate
  HTML file at build time. There is no SPA shell.
- **Islands for interactivity.** React components opt-in to client-side
  hydration via `client:load` / `client:idle` / `client:visible`.
- **File-based routing.** Astro replaces `react-router`. No client-side
  router code, no hashed JSON for routes.
- **Salesforce-aware.** The build emits `dist/` and the
  `@salesforce/vite-plugin-ui-bundle` plugin rewrites asset URLs to the
  runtime mount path.

## When to use Puebla

Use Puebla when you want…

- A modern Astro DX inside a Salesforce UI Bundle.
- Smaller payloads than the React template — pages ship as HTML.
- File-based routing without writing your own router.
- TypeScript-strict, Tailwind v4, and clean ESM out of the box.

## When **not** to use Puebla

If you have a heavily SPA-shaped app (deep client-side state, optimistic
updates across routes, etc.) the React template may serve you better.
Puebla optimizes for content-heavy or list/detail-style apps.

## What's next

- [Getting started](/docs/getting-started/) — scaffold and run.
- [Project structure](/docs/project-structure/) — what each file does.
- [Routing](/docs/guides/routing/) — how Astro pages map to URLs.
