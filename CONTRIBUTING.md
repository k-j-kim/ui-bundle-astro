# Contributing to Puebla

Thanks for your interest in contributing! This document outlines the workflow
for issues, pull requests, and local development.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold it.

## Getting started

```bash
git clone https://github.com/<your-fork>/puebla.git
cd puebla/force-app/main/default/uiBundles/BaseAstroApp
npm install
npm run dev
```

The website (landing + docs):

```bash
cd website/landing && npm install && npm run dev   # landing
cd website/docs    && npm install && npm run dev   # docs
```

## Pull request workflow

1. Fork the repository and create your branch from `master`.
2. Make your changes in a focused commit.
3. Run `npm run check` to type-check the template.
4. Open a PR with a clear description of the problem, the fix, and any
   screenshots if it's a UI change.

## Reporting bugs

Open a GitHub issue with:

- **Repro steps** — minimum code to reproduce
- **Expected vs actual** behavior
- **Environment** — Node version, OS, Salesforce API version

## Style

- TypeScript strict mode.
- Tailwind utility classes; no inline styles unless dynamic.
- Astro components for static UI; React only for interactive islands.
- Keep PRs small and focused.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
