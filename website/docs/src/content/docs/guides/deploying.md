---
title: Deploying
description: Build and deploy to a Salesforce org.
---

## Build

```sh
npm run build
```

This runs two steps:

1. **`astro build`** — compiles pages to `dist/`.
2. **`scripts/postbuild.mjs`** — post-processing for Salesforce compatibility.

### What `postbuild.mjs` does

The post-build script handles three things that Salesforce requires:

**1. URL rewriting.** Astro emits absolute URLs (`/assets/main.css`, `/contacts`). Salesforce serves the bundle under a dynamic mount path. The script rewrites these to relative paths (`./assets/main.css`, `./contacts`).

**2. Script externalization.** Salesforce's strict Content Security Policy blocks inline `<script>` tags. The script extracts inline script content to separate `.js` files and replaces them with `<script src="...">` references.

**3. Fallback validation.** Checks that `dist/index.html` exists — required for SPA-style deep-link support via `spaFallback` in `ui-bundle.json`.

### Build output

```text
dist/
├── index.html          # Dashboard
├── accounts.html
├── contacts.html
├── opportunities.html
├── about.html
├── 404.html
└── assets/
    ├── *.js            # React runtime + islands
    └── *.css           # Tailwind output
```

Each page is a standalone HTML file. Only pages with React islands include JS.

## Deploy

From your SFDX project root (the directory with `sfdx-project.json`):

```sh
sf project deploy start \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

### Validate first

Dry-run the deployment without activating:

```sh
sf project deploy validate \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

### Deploy a single bundle

If you have multiple bundles, deploy just yours:

```sh
sf project deploy start \
  --source-dir force-app/main/default/uiBundles/MyApp \
  --target-org my-org
```

## CI/CD

Example GitHub Actions step:

```yaml
- run: npm ci
  working-directory: force-app/main/default/uiBundles/MyApp
- run: npm run build
  working-directory: force-app/main/default/uiBundles/MyApp
- run: sf project deploy start --source-dir force-app/main/default/uiBundles --target-org prod
```

Make sure your CI environment has:
- Node 22+
- Salesforce CLI (`sf`) authenticated to the target org
- The `@salesforce/sdk-data` package (installed via `npm ci`)

## `.forceignore`

The template's `.forceignore` excludes build artifacts and dependencies from deployment:

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

Only `dist/`, `ui-bundle.json`, and `*.uibundle-meta.xml` are deployed.
