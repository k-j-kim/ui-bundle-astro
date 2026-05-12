---
title: Styling
description: Tailwind v4 configuration, theme tokens, and utility helpers.
---

The template uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin. No `tailwind.config.js` file — configuration uses CSS `@theme` blocks.

## Entry point

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-900: #312e81;
}

html, body { height: 100%; }
body {
  background:
    radial-gradient(1200px 500px at 10% -10%, #eef2ff 0%, transparent 60%),
    radial-gradient(900px 400px at 110% 10%, #fdf2f8 0%, transparent 60%),
    #f8fafc;
}
```

This file is imported once from `AppLayout.astro`:

```astro
---
import '@styles/global.css';
---
```

## Design tokens

The `@theme` block defines custom colors available as Tailwind utilities:

```html
<div class="bg-brand-50 text-brand-700">Branded element</div>
<button class="bg-brand-600 hover:bg-brand-700 text-white">Primary</button>
```

Add more tokens as needed:

```css
@theme {
  --color-brand-50:  #eef2ff;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;

  /* Add your own */
  --color-success: #10b981;
  --color-danger:  #ef4444;
  --font-family-mono: 'JetBrains Mono', monospace;
}
```

## Class merging with `cn()`

The `cn()` utility merges Tailwind classes safely using `clsx` + `tailwind-merge`:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Use it in components that accept custom classes:

```astro
---
// src/components/Card.astro
interface Props { title?: string; class?: string }
const { title, class: className = '' } = Astro.props;
---
<section class:list={[
  'rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm',
  className,
]}>
  {title && <h2 class="text-sm font-semibold">{title}</h2>}
  <slot />
</section>
```

In React islands, use `cn()` directly:

```tsx
<td className={cn(
  'px-4 py-2.5',
  col.align === 'right' && 'text-right tabular-nums',
  col.muted ? 'text-slate-500' : 'text-slate-900',
)}>
```

## Component patterns

### Static Astro component (zero JS)

```astro
---
// src/components/StatTile.astro
interface Props {
  label: string;
  value: string;
  delta?: string;
  tone?: 'up' | 'down' | 'flat';
  icon?: string;
}
const { label, value, delta, tone = 'flat', icon } = Astro.props;
const toneClass =
  tone === 'up'   ? 'text-emerald-700 bg-emerald-50' :
  tone === 'down' ? 'text-rose-700 bg-rose-50' :
                    'text-slate-600 bg-slate-50';
---
<div class="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
  <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
  <p class="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
  {delta && (
    <p class:list={['mt-3 inline-flex px-2 py-0.5 text-xs font-medium rounded-full', toneClass]}>
      {tone === 'up' ? '▲' : tone === 'down' ? '▼' : '•'} {delta}
    </p>
  )}
</div>
```

Usage:

```astro
<StatTile label="Accounts" value="1,284" delta="+4.2%" tone="up" icon="🏢" />
```

### Vite plugin

The Tailwind v4 Vite plugin is registered in `astro.config.mjs`:

```js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), salesforce()],
  },
});
```

No `postcss.config.js` or separate Tailwind config needed.
