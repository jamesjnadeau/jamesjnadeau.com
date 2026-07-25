# AGENT.md

Guidance for AI coding agents working in this repository.

## What this is

The personal website at https://jamesjnadeau.com — a static site built with
[Eleventy 3](https://www.11ty.dev/) using Pug templates, Markdown, and Sass.
There is no application server and no database.

## Commands

```bash
nvm use              # Node 24 (.nvmrc: 24.18.0)
npm ci               # install; use `ci`, not `install`
npm run dev          # Eleventy dev server on :8080
npm run build        # production build (PurgeCSS on) into _site/
npm test             # build + content + html + links + a11y
npm run test:lighthouse   # separate: slower, load-sensitive
```

`npm run build` cleans `_site/` first — Eleventy does not remove stale output on
its own, and leftover files from a previous build will fail the output tests.
If you see a test blaming a file you already deleted, you have a dirty `_site/`.

The a11y and Lighthouse checks need a headless Chrome. Puppeteer downloads one on
`npm ci`; `npx puppeteer browsers install chrome` fixes it if install scripts were
blocked. `scripts/lighthouse.mjs` resolves that browser for Lighthouse CI, which
otherwise only looks for a system Chrome — don't call `lhci` directly.

## Layout

| Path | Purpose |
|---|---|
| [content/](content/) | Eleventy **input** directory (not `src/`) |
| `content/_includes/layouts/` | `main.pug` (site) and `presentation.pug` (impress.js decks) |
| [content/til/](content/til/) | "Today I ..." posts, tagged `TIL` via `til.11tydata.json` |
| [content/projects/](content/projects/) | Project write-ups (mostly Markdown) |
| [content/presentations/](content/presentations/) | impress.js slide decks |
| [content/reference/](content/reference/) | Reference pages |
| [content/styles/](content/styles/) | Sass; `main.scss` and `impressjs.scss` are the entry points |
| [static/](static/) | Passthrough-copied to site root |
| `test/content/` | Source + built-output invariants (`node:test`, no browser) |
| `test/a11y/` | axe-core scan; needs a server, driven by `test:a11y` |
| `test/urls.json` | The ~10 representative URLs a11y and Lighthouse both scan |
| `scripts/` | Build/test helpers |
| `_site/` | Build output — gitignored, never edit or commit |

## Conventions

- **Templates are Pug**, not Nunjucks/Liquid. Markdown is used for older project
  and reference entries; new TIL posts are Pug.
- **Front matter keys are lower case.** `date:`, `title:`, `description:` — a
  capitalised key silently does nothing and `test:content` will fail. Dates must
  be ISO 8601; Eleventy parses them with Luxon and a `MM/DD/YYYY` value **fails
  the build**.
- **`description:` must be unique per page** and is asserted against placeholder
  text. Quote any value containing `: ` or YAML parsing breaks.
- **Sass partials must be `_`-prefixed** or eleventy-sass compiles them into
  standalone orphan CSS files.
- **Front-end JS is vendored from `node_modules`** via passthrough copy in
  `.eleventy.js` and served from `/js/`. Do not reintroduce CDN `<script>` tags —
  `test:content` asserts against them.
- Bootstrap 5 is the CSS framework, pulled from `node_modules` through the Sass
  `loadPaths` config.
- PurgeCSS only runs when `NODE_ENV=production`. If you add classes constructed
  at runtime, verify they survive a production build.

## Gotchas

- **Renaming a `content/til/*` file changes its public URL.** Eleventy does *not*
  strip the `YYYY-MM-DD-` prefix here — posts live at `/til/2016-10-11-node-pre-gyp/`.
  Some filenames disagree with their front-matter `date:`; that's cosmetic and
  deliberate. Add a `permalink:` if you must rename.
- `content/til/index.pug` sets `eleventyExcludeFromCollections: [TIL]` so it stays
  out of its own RSS feed. Don't remove it.
- **The presentation decks are held to a lower bar on purpose.**
  `.htmlvalidate.decks.json` relaxes markup rules there, `test/a11y/axe.test.js`
  waives `meta-viewport`, and `lighthouserc.cjs` drops decks to an accessibility
  warning. Content pages stay strict. Every waiver states its reason — shrink
  these lists, don't grow them, and don't extend a deck waiver to content pages.
- `static/files/` holds ~15MB of assets, a number of them unreferenced but still
  published. Being unlinked is not the same as being private — everything under
  `static/` is fetchable by path. Check before adding anything sensitive.
- Adding a page to `test/urls.json` costs a Lighthouse run and an axe run. Ten
  URLs covering both layouts is the intent, not full coverage — the pages are
  template-generated, so breadth buys little.

## Unresolved

`static/files/clevertech_stinks/` (invoices and a work-for-hire agreement) was
removed from the working tree, but **it is still in git history** and therefore
still recoverable from any clone. Purging it needs a history rewrite
(`git filter-repo`) and a force-push, which has not been done.

`static/files/wheelstv/` (2.9MB of video) is also unreferenced but still
published. Left in place — flagged, not decided.

## Deployment

`master` deploys two ways. GitHub Actions builds → tests → deploys to Pages (PRs
are tested, never published). Netlify builds with `npm ci --omit=dev` and holds
the `jamesnadeau.com` redirects.

## Commit style

Per [CONTRIBUTING.md](CONTRIBUTING.md): present tense, imperative mood, first line
≤ 72 chars, prefixed with a relevant emoji (`✨` feature, `🐛` bug, `📝` docs,
`⬆️` deps, `⚡` general).
