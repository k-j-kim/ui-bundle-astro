---
title: Deploying
description: Build a ui-bundle-astro bundle and deploy it to a Salesforce org.
---

ui-bundle-astro bundles deploy with the standard Salesforce CLI. There is no
custom deploy step.

## Build

From the bundle directory:

```sh
npm run build
```

The `build` script runs `astro build` and then `scripts/postbuild.mjs`,
which verifies that `dist/index.html` exists. The UI Bundle runtime
needs that file as a fallback for SPA-style deep links.

Output:

```text
dist/
├── index.html
├── accounts.html
├── 404.html
└── assets/
    ├── *.js
    └── *.css
```

## Deploy

From the SFDX project root:

```sh
sf project deploy start \
  --source-dir force-app/main/default/uiBundles \
  --target-org my-org
```

The `.forceignore` shipped with ui-bundle-astro excludes `node_modules`,
`src/`, `scripts/`, and the various config files from the deploy. Only
`dist/` and the metadata XML are sent.

## Validate the deploy

After deploy, verify in Setup → UI Bundles that your bundle is listed
and `Active`. Open the assigned mount path and you should see your
Astro pages rendered with assets loaded under that path.

## Environments

For CI, pin the build to a specific Node version (22.x) and cache
`node_modules`. The included GitHub Actions workflow at
`.github/workflows/ci.yml` is a working starting point.
