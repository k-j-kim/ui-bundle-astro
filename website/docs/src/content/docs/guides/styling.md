---
title: Styling with Tailwind
description: Tailwind v4 in a ui-bundle-astro bundle.
---

ui-bundle-astro ships with Tailwind v4 wired up via the official Vite plugin.

## Entry point

```css
/* src/styles/global.css */
@import "tailwindcss";
```

Imported once from `AppLayout.astro`:

```astro
---
import '../styles/global.css';
---
```

## Theme tokens

Tailwind v4 uses a `@theme` block in CSS to declare design tokens. Put
brand colors, fonts, and spacing scales there:

```css
@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-brand: #ff5d01;
  --color-bg: #0d0f14;
}
```

These become utility classes automatically — `bg-brand`, `text-brand`,
`font-sans`, etc.

## `cn()` helper

A standard `clsx` + `tailwind-merge` helper is included in `src/lib/utils.ts`:

```ts
import { cn } from '@lib/utils';

<div className={cn('px-4 py-2', isActive && 'bg-brand text-white')} />
```

`cn()` is safe to use inside React islands and Astro components alike.

## Dark mode

Set `html { color-scheme: dark }` in `global.css` and design with dark
backgrounds. If you need a toggle, add a small island that flips a
`data-theme` attribute on `<html>` and gate utilities with the
`[data-theme="dark"]` selector.

## Custom fonts

Either `@import` from Google Fonts in `global.css` or `<link rel>` in
`AppLayout.astro`. The Astro build will hash the CSS and let the
Salesforce plugin rewrite URLs at runtime.
