---
title: CLI commands
description: npm scripts and Salesforce CLI commands for a ui-bundle-astro bundle.
---

## npm scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Astro dev server at <http://localhost:4321>. |
| `npm run build` | Run `astro build`, then verify `dist/index.html` exists. |
| `npm run preview` | Serve the production build locally. |
| `npm run check` | Type-check the project with `astro check`. |
| `npm test` | Run unit tests via Vitest. |

## Salesforce CLI

### Generate a new bundle

```sh
sf template generate ui-bundle --name MyApp --template astro
```

### Deploy

```sh
sf project deploy start \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

### Validate (no commit)

```sh
sf project deploy validate \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

### Open the bundle

```sh
sf org open --target-org my-org --path /uib/MyApp
```

(Replace the path with whatever mount path your org assigns.)
