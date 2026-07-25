# AGENT.md

Guidance for AI coding agents working in this repository.

## What this is

The personal website at https://jamesjnadeau.com — a static site built with
[Eleventy 3](https://www.11ty.dev/) using Pug templates, Markdown, and Sass.
There is no application server, no database, and no test suite.

## Commands

```bash
npm install          # install deps (Node >= 22, see .nvmrc: 22.14.0)
npm run dev          # Eleventy dev server with --serve (port 8080)
npm run dev-netlify  # Netlify Dev wrapper (port 8888)
npm run build        # production build: NODE_ENV=production, output to _site/
npm run export       # build only the Eleventy step (what Netlify runs)
```

Notes:
- `CONTRIBUTING.md` references `npm run test`. **That script does not exist.**
  There are no tests. Do not claim tests pass.
- Both build/dev scripts pass `--node-options='--experimental-require-module'`;
  keep that flag if you touch the scripts — the Pug plugin needs it.
- `NODE_ENV=production` is what enables PurgeCSS ([.eleventy.js:99](.eleventy.js#L99)),
  so a dev build's CSS is much larger than production's. Expect that.

## Layout

| Path | Purpose |
|---|---|
| [content/](content/) | Eleventy **input** directory (not `src/`) |
| `content/_includes/layouts/` | Pug layouts: `main.pug`, `presentation.pug` |
| [content/til/](content/til/) | "Today I ..." posts — dated filenames, tagged `TIL` via `til.11tydata.json` |
| [content/projects/](content/projects/) | Project write-ups (mostly Markdown) |
| [content/presentations/](content/presentations/) | impress.js slide decks, forced to `layouts/presentation.pug` |
| [content/reference/](content/reference/) | Reference pages |
| [content/styles/](content/styles/) | Sass/CSS compiled by `eleventy-sass`; `main.scss` is the entry |
| [static/](static/) | Passthrough-copied to site root (`/impress/`, `/files/`, `/icons/`, …) |
| [src/scripts/](src/scripts/) | Stray legacy JS; **not** the Eleventy input dir |
| `_site/` | Build output — gitignored, never edit or commit |

## Conventions

- **Templates are Pug**, not Nunjucks/Liquid. Markdown is used for older
  project and TIL entries; new TIL posts are Pug.
- **TIL filenames** follow `YYYY-MM-DD-kebab-title.pug` and carry front matter
  with `Date:` (ISO 8601) and `title:`. Follow the existing pattern exactly —
  see [content/til/2026-07-23-cracks-and-attention.pug](content/til/2026-07-23-cracks-and-attention.pug).
  The RSS feed at `/til/rss.xml` pulls the 10 newest items from the `TIL` collection.
- **Global defaults** (layout, title, description) are set in
  [.eleventy.js:40-44](.eleventy.js#L40-L44), not per-page.
- **Bootstrap 5** is the CSS framework, loaded from `node_modules` via the Sass
  `loadPaths` config. Front-end JS (Bootstrap bundle, headroom.js, barba.js)
  comes from jsDelivr CDN inside [main.pug](content/_includes/layouts/main.pug),
  not from a bundler.
- PurgeCSS scans built HTML/JS. If you add classes constructed dynamically at
  runtime, verify they survive a production build.
- `.eleventy.js` contains large commented-out blocks (the legacy Sass extension
  approach). Leave them unless asked — they are deliberate notes.

## Deployment

Two paths, both from `master`:
- **Netlify** ([netlify.toml](netlify.toml)) — `npm install && npm run export`, publishes `_site`.
  Also holds the `jamesnadeau.com` → `jamesjnadeau.com` redirects.
- **GitHub Pages** ([.github/workflows/eleventy-github-pages.yml](.github/workflows/eleventy-github-pages.yml)) —
  builds on push/PR to `master` and deploys the `_site` artifact.

## Commit style

Per [CONTRIBUTING.md](CONTRIBUTING.md): present tense, imperative mood, first
line ≤ 72 chars, and prefixed with a relevant emoji (`✨` feature, `🐛` bug,
`📝` docs, `⬆️` dep upgrade, `⚡` general update). Recent history is looser than
the guide, but matching it is preferred.

## Gotchas

- Linter configs exist (`.eslintrc` for airbnb/base, `.pug-lintrc`,
  `.textlintrc.js`) but **no npm script runs them** and the linters are not
  installed as dependencies. Don't invoke them expecting them to work.
- The `README.md` section on vendoring `node_modules` into git is historical.
  `node_modules` is gitignored today; don't act on that advice.
- `package.json` `description` is literally `"TODO"`.
