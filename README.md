My personal website
===
https://jamesjnadeau.com

Built with [Eleventy](https://www.11ty.dev/) using Pug templates, Markdown, and Sass,
and hosted on [Netlify](https://www.netlify.com/).

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
nvm use
export NODE_AUTH_TOKEN=ghp_…   # classic PAT with read:packages
npm ci
npm run dev      # dev server on :8080
```

`NODE_AUTH_TOKEN` is needed because the page editor,
[`@jamesjnadeau/content-tools`](https://github.com/jamesjnadeau/ContentTools),
is installed from GitHub Packages, which requires a token even for public
packages. Make a *classic* personal access token with only `read:packages`;
`.npmrc` reads it from the environment, so never write it into a file here.

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
| `npm run test:cms` | Smoke test of the in-page editor in headless Chrome |
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

## Editing a page on the site

The markdown pages (projects, reference pages, and the older TIL posts) can be
edited right on the page:

1. Go to `/admin/` on the Netlify site and press **Sign in** (a Netlify
   Identity account; accounts are invite-only).
2. Pick a page and press **Edit**, or just open any markdown page while signed
   in. Press the **pencil** at the top left and type into the page.
3. Press **Submit for review**. The change becomes a pull request against
   `master`, with its own deploy preview, and goes live when it's merged.

Pug pages (newer TIL posts, the index pages, presentations) aren't editable
this way. See `AGENT.md` for how it's wired up.

## Deployment

Netlify builds and hosts the site, configured by `netlify.toml`: every push to
`master` deploys, and every pull request gets a deploy preview. The Netlify
site is https://poetic-tarsier-d94f11.netlify.app. It needs `NODE_AUTH_TOKEN`
(see above) set in its environment variables, and hosts Netlify Identity and
Git Gateway for the page editor.

The move off GitHub Pages is in progress: until the `jamesjnadeau.com` domain
points at Netlify, `.github/workflows/eleventy-github-pages.yml` still builds,
tests and publishes `master` to Pages. The page editor only works on the
Netlify URL until then. Once the domain moves, that workflow's deploy job and
the repository's Pages setting go; the workflow stays as the pull request test
gate either way.
