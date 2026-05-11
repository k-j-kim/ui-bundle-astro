# Puebla

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01)](https://astro.build)
[![Salesforce](https://img.shields.io/badge/Salesforce-UI%20Bundle-00A1E0)](https://developer.salesforce.com)

> An Astro-based Salesforce UI Bundle template. A drop-in alternative to the
> `reactbasic` template — file-based routing, zero-JS by default, React only
> where you need it.

## What's in the box

- **`force-app/main/default/uiBundles/BaseAstroApp`** — the UI Bundle template
- **`website/`** — landing page and docs (built with Astro + Starlight)

## Quick start

```bash
cd force-app/main/default/uiBundles/BaseAstroApp
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
```

Deploy from the SFDX project root:

```bash
sf project deploy start \
  --source-dir force-app/main/default/uiBundles \
  --target-org <alias>
```

## Why Astro for UI Bundles?

- **Zero-JS by default.** Pages ship as static HTML; React hydrates only the
  islands that need it (`client:load`, `client:idle`).
- **File-based routing.** `src/pages/*.astro` becomes `dist/<route>.html`.
  No `react-router`, no client-side bundle for navigation.
- **Salesforce-aware.** `base: './'` plus
  `@salesforce/vite-plugin-ui-bundle` rewrites asset URLs at runtime so the
  bundle works under whatever mount path Salesforce assigns.

## Documentation

- 🌐 **Landing page**: `website/landing/`
- 📖 **Docs**: `website/docs/`
- 🧩 **Template README**: [BaseAstroApp/README.md](force-app/main/default/uiBundles/BaseAstroApp/README.md)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © Puebla contributors
