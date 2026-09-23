# AGENT.md

Guidance for AI coding agents working in this repository.

## What this is

The personal website at https://jamesjnadeau.com — a static site built with
[Eleventy 3](https://www.11ty.dev/) using Pug templates, Markdown, and Sass,
hosted on Netlify. There is no application server and no database; the
markdown pages can be edited in place through ContentTools (see *Editing*).

## Commands

```bash
nvm use              # Node 24 (.nvmrc: 24.18.0)
export NODE_AUTH_TOKEN=…   # classic PAT with read:packages; see below
npm ci               # install; use `ci`, not `install`
npm run dev          # Eleventy dev server on :8080
npm run build        # production build (PurgeCSS on) into _site/
npm test             # build + content + html + links + a11y + cms
npm run test:lighthouse   # separate: slower, load-sensitive
```

`npm run build` cleans `_site/` first — Eleventy does not remove stale output on
its own, and leftover files from a previous build will fail the output tests.
If you see a test blaming a file you already deleted, you have a dirty `_site/`.

**`npm ci` needs `NODE_AUTH_TOKEN`.** `@jamesjnadeau/content-tools` is published
to GitHub Packages, whose npm registry requires a token even for a public
package, and `.npmrc` reads it from the environment. Locally that's a *classic*
PAT with `read:packages` (the registry doesn't take fine-grained tokens); in
Actions it's the job's `GITHUB_TOKEN`; on Netlify it's a `NODE_AUTH_TOKEN`
environment variable in the site settings. Never put a token in `.npmrc` or
`netlify.toml`, which are public. npm commands that don't install still work
without one.

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
| `test/cms/` | Puppeteer smoke test of the in-page editor, driven by `test:cms` |
| `content/_data/eleventyComputed.js` | `cmsEntry`: which markdown pages are editable |
| `content/admin/` | `/admin/`, the ContentTools management screens |
| `static/cms/` | Site glue for the editor: Netlify Identity + Git Gateway (`netlify.js`), the in-page loader (`boot.js`) |
| `static/cms-config.yml` | ContentTools config: repository, collections, fields |
| `netlify.toml` | Netlify build config |
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

## Editing

The markdown pages in `content/projects/`, `content/reference/` and
`content/til/` can be edited on the published page with
[ContentTools](https://github.com/jamesjnadeau/ContentTools). The plan it was
built from is `docs/superpowers/plans/2026-09-22-contenttools-markdown-editor.md`.

- The editor is the `@jamesjnadeau/content-tools` package, **pinned exactly**
  (it's a release candidate), copied from `node_modules` into `/cms/` by
  `.eleventy.js`. Nothing is vendored into the repo. To upgrade: bump the
  version, `npm install`, `npm test` (which runs `test:cms`), then edit one
  page for real and check the pull request's diff is only what you changed.
- Authors sign in at `/admin/` with **Netlify Identity**. `static/cms/netlify.js`
  sends ContentTools' GitHub API calls through Netlify's **Git Gateway**, which
  holds the GitHub credential, and every save opens a pull request against
  `master`. It's ported from vermont-football-officials; keep fixes in step.
- A page is editable only if it **says so itself**: `eleventyComputed.js` gives
  markdown pages in those folders a `cmsEntry`, and `layouts/main.pug` then
  emits `<meta name="cms:entry">` and wraps the body in `[data-cms-body]`.
  URL matching alone would also claim the Pug pages in `til/` and `reference/`.
  The editor replaces the children of `[data-cms-body]`, so it must hold the
  rendered markdown and nothing else.
- The folder list in `eleventyComputed.js`, the collections in
  `static/cms-config.yml` and `REPO`/`BRANCH` in `netlify.js` must agree;
  `test/content/cms.test.js` checks all three, and that each collection's
  `fields` are exactly the front matter keys its files use.
- `eleventyComputed.js` must keep a single default export: Eleventy unwraps
  `default` only when it's alone, and a named export beside it hides
  `cmsEntry` from every template.
- PurgeCSS skips `_site/cms/**` and the Identity widget (`skippedContentGlobs`).
  The editor stylesheet styles markup no page contains until editing starts,
  and a purged copy fails silently. A test checks it ships byte-for-byte.
- Readers load nothing: the inline script in `main.pug` sets
  `window.cmsAuthoring` from an Identity session, a handed-over token or
  `?cms-edit`, and only then imports `/cms/boot.js`.

## Gotchas

- **Renaming a `content/til/*` file changes its public URL.** Eleventy does *not*
  strip the `YYYY-MM-DD-` prefix here — posts live at `/til/2016-10-11-node-pre-gyp/`.
  Some filenames disagree with their front-matter `date:`; that's cosmetic and
  deliberate. Add a `permalink:` if you must rename.
- **Barba page transitions are off for authors** (`window.cmsAuthoring`). The
  in-page editor binds to the page it started on, and Barba swaps `#container`
  without a load. Readers keep the transitions; `test:cms` checks both.
- **Renaming a markdown file changes its editor entry as well as its URL.** An
  open `cms/<collection>/<slug>` pull request is where that entry's unmerged
  edits live, and it won't follow the rename.
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

**Netlify is the host.** The site is moving off GitHub Pages: Netlify builds it
from `netlify.toml` (`npm run build`, publish `_site/`, Node from `.nvmrc`),
deploys `master`, and builds a deploy preview for every pull request at
`https://deploy-preview-<n>--poetic-tarsier-d94f11.netlify.app`. It also hosts
Netlify Identity and Git Gateway for the editor, which GitHub Pages can't.
The Netlify site is https://poetic-tarsier-d94f11.netlify.app.

**Until `jamesjnadeau.com` points at Netlify**, GitHub Pages still serves it:
`.github/workflows/eleventy-github-pages.yml` runs build → test → deploy on
`master`. On the live domain the editor can't sign anyone in, because there is
no `/.netlify/` behind it; edit on the Netlify URL. When the domain moves,
delete that workflow's `deploy` job and the repo's Pages setting, and keep
build + test as the pull request gate.

GitHub Actions still runs the full suite on every pull request. Its build job
installs with `npm ci --omit=dev`, so anything the build itself needs belongs in
`dependencies`; putting it in `devDependencies` passes locally and on Netlify
(which installs both) and fails CI.

Netlify needs, in the dashboard rather than the repo: `NODE_AUTH_TOKEN` (for
GitHub Packages; see *Commands*), Identity enabled with invite-only
registration, and Git Gateway connected to `jamesjnadeau/jamesjnadeau.com`.
Identity's invite and password-reset emails link to the site root; the layout
loads the widget for those links and sends the author on to `/admin/`.

Netlify-only behavior (`_redirects`, custom headers, functions) is fine to add
once the domain has moved. Before then, the live site would silently lack it.

## Commit style

Per [CONTRIBUTING.md](CONTRIBUTING.md): present tense, imperative mood, first line
≤ 72 chars, prefixed with a relevant emoji (`✨` feature, `🐛` bug, `📝` docs,
`⬆️` deps, `⚡` general).
