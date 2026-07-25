My personal website
===
https://jamesjnadeau.com

Built with [Eleventy](https://www.11ty.dev/) using Pug templates, Markdown, and Sass.

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
nvm use
npm ci
npm run dev      # dev server on :8080
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Eleventy dev server with live reload |
| `npm run build` | Production build (PurgeCSS on) into `_site/` |
| `npm test` | Build, then run every check below |
| `npm run test:content` | Front matter and built-output invariants |
| `npm run test:html` | HTML validation |
| `npm run test:links` | Internal link check (no network) |
| `npm run test:a11y` | axe-core accessibility scan |
| `npm run test:lighthouse` | Lighthouse budgets |
| `npm run test:links:external` | Outbound link check — slow, weekly in CI |

## Deployment

Both targets build from `master`:

- **GitHub Pages** via `.github/workflows/eleventy-github-pages.yml` — builds,
  runs the full suite, and only then deploys. Pull requests are tested but not published.
- **Netlify** via `netlify.toml` — also holds the `jamesnadeau.com` → `jamesjnadeau.com` redirects.
