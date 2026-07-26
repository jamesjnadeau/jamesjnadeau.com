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

The accessibility and Lighthouse checks drive a headless Chrome that Puppeteer
downloads during `npm ci`. If your npm blocks install scripts and those checks
complain about a missing browser, fetch it once with:

```bash
npx puppeteer browsers install chrome
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
| `npm run test:lighthouse` | Lighthouse budgets (not part of `npm test`) |
| `npm run test:links:external` | Outbound link check — slow, weekly in CI |

`npm run build` wipes `_site/` first. Eleventy leaves stale output behind
otherwise, and files from a previous build will fail the output tests.

## Writing a post

Add a file to `content/til/` named `YYYY-MM-DD-some-slug.pug`:

```pug
---
date: 2026-07-23
title: Cracks and Attention
description: A short summary — this becomes the meta description.
---

p You can learn a lot by listening and paying attention.
```

Rules the test suite enforces:

- **Front matter keys are lower case.** `Date:` is silently ignored by Eleventy;
  the build will not warn you, but `npm test` will fail.
- **`date:` must be ISO 8601** (`2026-07-23`, or a full timestamp). A `MM/DD/YYYY`
  value **fails the build** — Eleventy parses dates with Luxon.
- **`description:` must be unique** across the site and not placeholder text. If a
  description contains a colon, quote the whole value or YAML parsing breaks.
- The filename's date prefix is organisational only. Ordering comes from `date:`.

**Renaming a post changes its URL.** Eleventy does not strip the `YYYY-MM-DD-`
prefix here — posts live at `/til/2016-10-11-node-pre-gyp/`. Add a `permalink:`
if you need to rename one without breaking the old link.

Projects, reference pages, and presentations work the same way; see
[CONTRIBUTING.md](CONTRIBUTING.md) for what each check enforces.

## Deployment

GitHub Pages is the only host. `.github/workflows/eleventy-github-pages.yml`
builds from `master`, runs the full suite against those exact bytes, and only
then publishes. Pull requests are tested but never published.

The custom domain (`jamesjnadeau.com`) lives in the repository's Pages settings,
not in a `CNAME` file — deployments made from a workflow don't read one.

Pages serves static files and nothing else: no redirect rules, no custom
headers. Anything of that sort has to happen at the DNS/registrar level.
