---
title: CLI commands
description: npm scripts and Salesforce CLI commands used with the template.
---

## npm scripts

These are defined in the template's `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && node scripts/postbuild.mjs",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest"
  }
}
```

### `npm run dev`

Starts the Astro dev server at `http://localhost:4321` with hot module replacement.

```sh
npm run dev
```

React islands hydrate in the browser. The Salesforce Data SDK won't connect to a real org — queries will fail with "not available on this surface". Use this mode for layout and component work.

### `npm run build`

Runs two steps:

```sh
astro build && node scripts/postbuild.mjs
```

1. **`astro build`** — compiles `.astro` pages to static HTML in `dist/`.
2. **`scripts/postbuild.mjs`** — applies three Salesforce-specific transforms:

| Transform | What it does |
|---|---|
| URL rewriting | Converts absolute URLs (`/assets/main.css`, `/contacts`) to relative paths (`./assets/main.css`, `./contacts`) so they resolve under the dynamic Salesforce mount path. |
| Script externalization | Extracts inline `<script>` tags to separate `.js` files. Required because Salesforce's CSP blocks inline scripts. |
| Fallback validation | Checks that `dist/index.html` exists — required by `spaFallback` in `ui-bundle.json`. |

Output:

```text
[postbuild] rewrote 6 HTML file(s), 12 asset chunk(s), externalized 3 inline script(s); dist/index.html OK (4821 bytes)
```

### `npm run preview`

Serves the built `dist/` directory locally:

```sh
npm run preview
```

Useful for verifying the production build before deploying. Runs at `http://localhost:4321`.

### `npm run check`

Runs Astro's TypeScript type checker:

```sh
npm run check
```

This uses the `astro check` command which validates `.astro` files and TypeScript against the `tsconfig.json` config that extends `astro/tsconfigs/strict`.

### `npm test`

Runs unit tests via Vitest:

```sh
npm test
```

## Salesforce CLI (`sf`)

### Deploy the bundle

From your SFDX project root (the directory containing `sfdx-project.json`):

```sh
sf project deploy start \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

### Deploy a single bundle

If your project has multiple bundles:

```sh
sf project deploy start \
  --source-dir force-app/main/default/uiBundles/MyApp \
  --target-org my-org
```

### Validate without deploying

Dry-run the deployment to check for errors without activating:

```sh
sf project deploy validate \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

### Open the bundle in your org

```sh
sf org open --target-org my-org --path /lwr/application/ai/c-MyApp
```

The exact path depends on your org's configuration. Check your org's UI Bundle settings for the mount path.

### Check deployment status

```sh
sf project deploy report --target-org my-org
```

## Node.js requirements

The template requires Node 22+:

```json
{
  "engines": {
    "node": ">=22"
  }
}
```
