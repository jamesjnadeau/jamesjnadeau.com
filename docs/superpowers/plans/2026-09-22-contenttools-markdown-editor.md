# ContentTools Markdown Editor Implementation Plan

> **For agentic workers:** Work through this plan task by task, in order. Steps use checkbox (`- [ ]`) syntax for tracking. Every task ends green (`npm run build && npm run test:content`) and with a commit.

**Goal:** Let the site's author edit the site's **markdown** pages (`content/projects/*.md`, `content/reference/*.md`, `content/til/*.md`) in place on the published page. Sign-in uses Netlify Identity. Every save becomes a pull request against `master`. Pug pages, presentations and everything else stay out of the editor.

**Reference implementation:** `jamesjnadeau/vermont-football-officials` (VFO), which does the same thing with a *vendored* build of the fork in `static/cms/`. This plan follows its architecture (Identity + Git Gateway glue, an inline loader gate in the layout, `/admin/`, a config in `static/cms-config.yml`). It differs in two ways:

- **The editor comes from the published package**, `@jamesjnadeau/content-tools` on GitHub Packages (`npm.pkg.github.com`). It is copied out of `node_modules` by Eleventy passthrough. Nothing is vendored, and there is no `vendor.sh`.
- **Markdown only, no site tools.** VFO's `static/cms/site/` (grids, card notes, `window.contentToolsEdit`) has no counterpart here. Raw-HTML blocks in these pages show as read-only blocks, and that's accepted for now (see *Out of scope*).

**Architecture:**

```
node_modules/@jamesjnadeau/content-tools/dist/   --passthrough-->  _site/cms/{edit.js, shell.js, chunks/, images/, content-tools-content.min.css}
static/cms/{boot.js, netlify.js}                 --passthrough-->  _site/cms/{boot.js, netlify.js}          (site glue, ported from VFO)
node_modules/netlify-identity-widget/build/...   --passthrough-->  _site/js/netlify-identity-widget.js
static/cms-config.yml                            --passthrough-->  _site/cms-config.yml
content/admin/index.pug                          ------------->    _site/admin/index.html                  (<content-tools-cms>, IdentityAdapter)
content/_data/eleventyComputed.js                 computes `cmsEntry` ("projects/bosch") for markdown pages only
content/_includes/layouts/main.pug                on cmsEntry pages: <meta name="cms:entry">, <div data-cms-body>, and the loader gate
```

- A page is an entry **only if the page itself says so** (`<meta name="cms:entry">` + `[data-cms-body]`), and only markdown pages say so. This matters here: `content/til/` and `content/reference/` mix `.md` and `.pug` pages under the same URL shape. A `page: /til/{{slug}}/` template would otherwise claim a Pug post, and a signed-in author would get an error bar on it.
- The loader gate is VFO's. A reader's browser answers a few storage lookups and loads nothing. An author's browser loads `/cms/boot.js`: one with a Netlify Identity session, a token handed across from `/admin/`, `?cms-edit` on the URL, or `#cms-token=` in the fragment. `boot.js` installs the Git Gateway `fetch`, files the Identity JWT where `edit.js` looks for it, then imports `edit.js`.
- **The same gate switches Barba off.** `main.pug` runs `barba.init()` for page transitions, which swaps `#container` without a page load. `edit.js` boots once per page load and binds to one entry, so an author navigating by Barba would have a bar for the wrong page and an editor over a node that is gone. Authors get plain page loads. Readers keep the transitions.

**Tech stack:** Eleventy 3 + Pug (existing), `@jamesjnadeau/content-tools` (ESM, served as static files from `/cms/`), `netlify-identity-widget`, `node:test` for everything that doesn't need a browser, Puppeteer (already a devDependency) for one smoke test.

## Decisions already made

1. **The published package, not a vendored build**, per the request.
2. **Markdown files only**, per the request: three folder collections (`projects`, `reference`, `til`), `create: false`, `delete: false`. The editor edits existing entries; new pages are still written by hand.
3. **Netlify Identity for sign-in** (user, mid-planning): the site is now deployable to Netlify, and Identity is the provider. Authors need a site login, not a GitHub token. Writes go through Git Gateway, which holds the GitHub credential in the Netlify dashboard.
4. **The Netlify site is `poetic-tarsier-d94f11`** (https://poetic-tarsier-d94f11.netlify.app). Its deploy previews are `https://deploy-preview-{{pr}}--poetic-tarsier-d94f11.netlify.app`, which is `site.preview` in the config.
5. **The Netlify build is configured by `netlify.toml`** in the repo, not the dashboard. It was added with this plan (`npm run build`, publish `_site`, Node from `.nvmrc`, `PUPPETEER_SKIP_DOWNLOAD=1`), and the Deployment section of `AGENT.md` was updated to match. The editor tasks below change it only where they say so.

## Global constraints

- **Registry auth everywhere `npm ci` runs.** GitHub Packages' npm registry requires a token **even for a public package**. That covers local dev, the GitHub Actions `build` and `test` jobs, the Netlify build, and any other workflow that installs (check `.github/workflows/external-links.yml`). A clean clone without `NODE_AUTH_TOKEN` can no longer install. That cost is accepted by choosing the package, and Task 8 documents it.
- The package goes in **`dependencies`**, not `devDependencies`: the Actions build job runs `npm ci --omit=dev`, and the build copies files out of it. Same for `netlify-identity-widget`.
- **Pin the exact version** (`"2.0.0-rc.2"` or whatever Task 0 finds, no caret). It's a release candidate, and a caret on a prerelease still floats between prereleases.
- **Never edit files under `_site/cms/` that come from the package.** Site glue lives in `static/cms/` and must not share a name with anything in the package's `dist/` (a test asserts it).
- **Byte preservation is the fork's job, not ours.** Don't post-process what the editor writes. The manual check in Task 9 is what proves an edit to one paragraph produces a one-paragraph diff.
- Comments explain *why*, in full sentences, matching `.eleventy.js` and VFO's `static/cms/*.js`.
- Front matter keys stay lower case (`test/content/frontmatter.test.js`), so the config's `fields` use `title`, `description` and `date` only.
- Commit messages follow `CONTRIBUTING.md`: imperative, ≤ 72 chars, emoji prefix. End each one with the session's `Co-Authored-By` trailer.

## File structure

| Path | New/changed | What |
|---|---|---|
| `.npmrc` | new | `@jamesjnadeau` scope → `npm.pkg.github.com`, token from `${NODE_AUTH_TOKEN}` |
| `package.json`, `package-lock.json` | changed | two dependencies, `test:cms` scripts |
| `.eleventy.js` | changed | passthrough copies; PurgeCSS kept off `/cms/` |
| `static/cms-config.yml` | new | backend, media, site, three collections |
| `static/cms/netlify.js` | new | ported from VFO: `gatewayFetch`, `IdentityAdapter`, `fileSessionToken` |
| `static/cms/boot.js` | new | ported from VFO, minus the site extension |
| `content/_data/eleventyComputed.js` | new | `cmsEntry` for markdown pages |
| `content/_includes/layouts/main.pug` | changed | meta, body wrapper, loader gate, Barba gate |
| `content/admin/index.pug` | new | `/admin/` |
| `test/content/cms.test.js` | new | config ↔ content ↔ build invariants, gateway glue |
| `test/cms/edit.test.js` | new | Puppeteer smoke: bar appears on `?cms-edit` |
| `netlify.toml` | exists | added with this plan; the Netlify build only needs `NODE_AUTH_TOKEN` set in the dashboard |
| `.github/workflows/eleventy-github-pages.yml` | changed | registry auth, `packages: read`, run `test:cms` |
| `AGENT.md`, `README.md` | changed | how editing works, the registry token, Netlify |

---

### Task 0: Registry access and the package's actual layout

Nothing else can start until the package installs. Everything later assumes the `dist/` layout the fork's docs describe (`edit.js`, `shell.js`, `chunks/`, `images/`, `content-tools-content.min.css`), so check it against what was actually published.

- [ ] **Step 1: A token for local installs.** Create a **classic** PAT with `read:packages`. GitHub Packages' npm registry doesn't accept fine-grained tokens. Export it as `NODE_AUTH_TOKEN` in your shell profile, not in any file in the repo.

- [ ] **Step 2: `.npmrc`** at the repo root:

  ```ini
  # @jamesjnadeau/content-tools is published to GitHub Packages, which requires
  # a token even to install a public package. The token comes from the
  # environment and never from this file: locally a classic PAT with
  # read:packages, in Actions the job's GITHUB_TOKEN, on Netlify a site env var.
  @jamesjnadeau:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
  ```

- [ ] **Step 3: See what's published.**

  ```bash
  npm view @jamesjnadeau/content-tools versions dist-tags --json
  ```

  Record the newest version. The fork's `master` (`207c692`) says `2.0.0-rc.2`, and its README still says "never published to npm". The fork has no publish workflow on any branch, so this was published by hand. Confirm it rather than trust either.

- [ ] **Step 4: Install, pinned.**

  ```bash
  npm install --save-exact @jamesjnadeau/content-tools@<version> netlify-identity-widget
  ```

  Check that both landed in `dependencies`, and that `package-lock.json` resolves the package from `https://npm.pkg.github.com/...`.

- [ ] **Step 5: Check the layout.**

  ```bash
  ls node_modules/@jamesjnadeau/content-tools/dist/{edit.js,shell.js,content-tools-content.min.css} \
     node_modules/@jamesjnadeau/content-tools/dist/chunks \
     node_modules/@jamesjnadeau/content-tools/dist/images/icons.woff \
     node_modules/@jamesjnadeau/content-tools/app/index.html
  ls node_modules/@jamesjnadeau/content-tools/dist | grep -E '^(boot|netlify)\.js$' && echo "COLLISION"
  ```

  If `chunks/` or `images/` is missing, the tarball was packed without them, and the in-page editor can't work from this package. **Stop and fix the fork's `files`/build**, not this site.

- [ ] **Step 6: Grant Actions access (manual, in GitHub).** Package settings → *Manage Actions access* → add `jamesjnadeau/jamesjnadeau.com` with *Read*. Without it the job's `GITHUB_TOKEN` gets a 403 from the registry, even though you own both.

- [ ] **Step 7: Netlify env var (manual, in Netlify).** Don't put the token in `netlify.toml`, which is public. Site configuration → Environment variables → `NODE_AUTH_TOKEN` = a classic PAT with `read:packages` only, scoped to *Builds*. Trigger a deploy and confirm `npm install` succeeds in the Netlify log.

- [ ] **Step 8: Commit** `.npmrc`, `package.json`, `package-lock.json`: `⬆️ Add ContentTools and the Netlify Identity widget`.

### Task 1: Serve the editor from `/cms/`, and keep PurgeCSS off it

**Files:** `.eleventy.js`, `test/content/cms.test.js` (new)

- [ ] **Step 1: Failing test.** Create `test/content/cms.test.js` with a header comment in the style of `output.test.js`. It needs `_site/`, like `output.test.js`, so skip with the same thrown error when `_site` is absent. Port VFO's chunk-closure test (`test/content/content-tools.test.js`, "every chunk the vendored editor imports is there"), pointed at `_site/cms/`. Add:

  ```js
  // PurgeCSS runs over _site/**/*.css in production and would strip every
  // editor rule, because no page's HTML uses them until the editor starts.
  // The failure is silent: the editor comes up with no hover outlines, no drop
  // indicators and a toolbox of tofu boxes.
  test('the editor stylesheet is served exactly as the package ships it', () => {
    const pkg = readFileSync('node_modules/@jamesjnadeau/content-tools/dist/content-tools-content.min.css');
    assert.ok(readFileSync('_site/cms/content-tools-content.min.css').equals(pkg));
  });
  ```

  Run `npm run build && npm run test:content`. Expected: FAIL (no `_site/cms/`).

- [ ] **Step 2: Passthrough.** In `.eleventy.js`, next to the existing `node_modules` block:

  ```js
  // The ContentTools editor, from its published package (GitHub Packages;
  // see .npmrc). edit.js, shell.js and the chunks both import must sit in one
  // folder: the chunk names are content-hashed, and edit.js links the content
  // stylesheet and images/ relative to its own URL. _site/ is cleaned before
  // every production build, so a stale chunk from an older version can't
  // survive an upgrade. The site's own glue, static/cms/, is copied in beside it.
  const CT = "node_modules/@jamesjnadeau/content-tools/dist";
  eleventyConfig.addPassthroughCopy({
      [`${CT}/edit.js`]: "cms/edit.js",
      [`${CT}/shell.js`]: "cms/shell.js",
      [`${CT}/chunks`]: "cms/chunks",
      [`${CT}/images`]: "cms/images",
      [`${CT}/content-tools-content.min.css`]: "cms/content-tools-content.min.css",
      "node_modules/netlify-identity-widget/build/netlify-identity-widget.js": "js/netlify-identity-widget.js",
  });
  ```

- [ ] **Step 3: PurgeCSS.** `eleventy-plugin-purgecss@0.5.0` hands `config` straight to `new PurgeCSS().purge()`, and PurgeCSS 6 expands each `css` entry as its own glob, so a negated entry doesn't exclude anything. Run `NODE_ENV=production npm run build && find _site -name '*.css' -not -path '_site/cms/*'` and replace `"./_site/**/*.css"` with explicit roots covering exactly that list. Most likely that's `./_site/styles/**/*.css` plus whatever `static/` contributes. Keep the set of purged files otherwise identical: diff `find _site -name '*.css' | xargs md5sum` before and after, excluding `/cms/`.

  Fallback if the list is unwieldy: leave the glob alone and add `safelist: { greedy: [/^ce-/, /^ct-/] }`. The test in Step 1 decides which of these is good enough. It demands byte identity, so the fallback probably won't pass. That's deliberate.

- [ ] **Step 4:** `npm run build && npm run test:content` → PASS. Commit: `✨ Serve the ContentTools editor from /cms/`.

### Task 2: Mark markdown pages as entries

**Files:** `content/_data/eleventyComputed.js` (new), `content/_includes/layouts/main.pug`, `test/content/cms.test.js`

- [ ] **Step 1: Failing tests** in `cms.test.js`:
  - For every `content/{projects,reference,til}/*.md`: `_site/<dir>/<basename>/index.html` exists, contains `<meta name="cms:entry" content="<dir>/<basename>">`, and contains exactly one `data-cms-body`. The basename is taken **verbatim**: Eleventy keeps the `YYYY-MM-DD-` prefix on TIL URLs here (see `AGENT.md`), and `garden.org`, `Jupyter`, `secureCRM` keep their dots and case. Don't use `page.fileSlug`, which strips the date prefix.
  - No built page from a `.pug` source contains `cms:entry` or `data-cms-body` (check `_site/til/*/index.html`, `_site/reference/convert-video-to-png/index.html`, the three section indexes and `/`).

- [ ] **Step 2: `content/_data/eleventyComputed.js`.**

  ```js
  // Which ContentTools entry a page is ("projects/bosch"), or null.
  //
  // Only markdown pages in the three editable folders are entries. The page
  // itself declares it (layouts/main.pug), rather than the config matching
  // URLs, because til/ and reference/ also hold Pug pages at the same URL
  // shape, and the editor can only edit markdown. Keep the folder list in
  // step with the collections in static/cms-config.yml; a test compares them.
  const ENTRY = /^\.\/content\/(projects|reference|til)\/([^/]+)\.md$/;

  export default {
      cmsEntry: (data) => {
          const found = ENTRY.exec(data.page?.inputPath ?? "");
          return found ? `${found[1]}/${found[2]}` : null;
      },
  };
  ```

  Verify Eleventy 3 picks up `eleventyComputed` from a global data file (it does for `_data/eleventyComputed.js`). If `cmsEntry` comes out `undefined` in the template, fall back to three directory data files. `til/` already has `til.11tydata.json`; add a sibling `til.11tydata.js` for the computed key, since Eleventy merges both.

- [ ] **Step 3: Layout.** In `main.pug`'s `head`, after the description:

  ```pug
  if cmsEntry
    //- ContentTools: this page is an editable entry (content/_data/eleventyComputed.js).
    meta(name='cms:entry' content=cmsEntry)
  ```

  And replace the container body:

  ```pug
  #container.container.md-8.animated.fadeInRight(data-barba="container" data-barba-namespace=page.url)
    if cmsEntry
      //- The editor replaces this element's children with its own render of
      //- the markdown, so it must hold the rendered body and nothing else.
      div(data-cms-body) !{content}
    else
      | !{content}
  ```

  Check `content/styles/main.scss` for rules that the extra `div` would break (`#container > …`). None exist today; check again at implementation time.

- [ ] **Step 4:** Build, run `test:content` and `test:html`. html-validate must accept `name="cms:entry"`, and if it doesn't, fix the rule, not the name, because the fork reads that exact name. Commit: `✨ Mark markdown pages as editable entries`.

### Task 3: The Identity + Git Gateway glue

**Files:** `static/cms/netlify.js`, `static/cms/boot.js`, `test/content/cms.test.js`

- [ ] **Step 1: Port `netlify.js`** from VFO `static/cms/netlify.js` verbatim, except:
  - `REPO = 'jamesjnadeau/jamesjnadeau.com'`, `BRANCH = 'master'`.
  - `FROM_SESSION = 'jjn:token-from-identity'`.
  - `IdentityAdapter.gate.note`: `'Sign in with your jamesjnadeau.com site account.'`
  - Header comment: drop the references to `vendor.sh` and "vendored beside this file". The package is copied beside it by `.eleventy.js`.

  Keep `signed()` (author attribution on PRs/commits). With one author it's cheap, and it stays correct if you invite anyone else.

- [ ] **Step 2: Port `boot.js`** from VFO, minus `siteExtension` / `window.contentToolsEdit`. What's left is: install `gatewayFetch()` as `window.fetch`, `await fileSessionToken()`, `await import('./edit.js')`. Update the comment to point at this site's layout.

- [ ] **Step 3: Tests.** Port VFO's `gatewayFetch` tests from `test/content/content-tools.test.js` (everything from `// --- gatewayFetch` down) into `cms.test.js`, plus "the Git Gateway glue and the config name the same repository" (this one needs Task 4's config, so add it there). Add:

  ```js
  // The glue is copied into the same folder as the package's dist/. A file of
  // the same name in a future release would be silently overwritten by ours,
  // or ours by it, depending on passthrough order.
  test('the site glue shares no name with the package', () => {
    const pkg = new Set(readdirSync('node_modules/@jamesjnadeau/content-tools/dist'));
    assert.deepEqual(readdirSync('static/cms').filter((f) => pkg.has(f)), []);
  });
  ```

- [ ] **Step 4:** `npm run test:content` → PASS. Commit: `✨ Sign ContentTools in with Netlify Identity`.

### Task 4: The config

`site.preview` points at `poetic-tarsier-d94f11`'s deploy previews (Decision 4).

**Files:** `static/cms-config.yml`, `test/content/cms.test.js`

- [ ] **Step 1: Failing tests.** These import the package's own validator and URL mapping, both of which run without a DOM:

  ```js
  import { parseConfig, entryForUrl } from '@jamesjnadeau/content-tools/cms';
  // parse the YAML the way VFO's test does (gray-matter), then:
  const config = parseConfig(raw);   // throws a ConfigError naming the bad path
  ```

  - `parseConfig` accepts it.
  - The collection names are exactly the folders `eleventyComputed.js` recognises (read the regex out of the file, or export the list from it and import it).
  - For every markdown file, `entryForUrl(config, 'https://poetic-tarsier-d94f11.netlify.app/<dir>/<basename>/')` returns `{collection: <dir>, slug: <basename>}`. That's the direction `/admin/` uses to build Edit links. It also catches a `page:` template that disagrees with Eleventy's URLs.
  - `backend.repo`/`branch` match `netlify.js`'s `REPO`/`BRANCH` (ported from VFO).
  - Every `fields[].name` is lower case.

  Check the export names against the installed version's `dist/src/cms/index.d.ts` before relying on them.

- [ ] **Step 2: `static/cms-config.yml`.**

  ```yaml
  # Configuration for ContentTools (@jamesjnadeau/content-tools), the editor
  # at /admin/ and on the site's own markdown pages. Served at /cms-config.yml,
  # which is where the in-page editor looks for it.
  #
  # Authors sign in with Netlify Identity; ContentTools talks to GitHub through
  # Netlify's Git Gateway (static/cms/netlify.js), so `repo` and `branch` must
  # match the repository the gateway is connected to in the Netlify dashboard.
  # Every save opens a pull request against `branch`; nothing reaches the live
  # site until it is merged.
  #
  # Markdown only. Each collection is one folder's .md files. Pug files in the
  # same folders are not entries, and the pages say which they are
  # (content/_data/eleventyComputed.js), so `page:` below is only used to build
  # links from /admin/.

  backend:
    repo: jamesjnadeau/jamesjnadeau.com
    branch: master

  site:
    # A pull request's Netlify deploy preview, so a draft can be edited on the
    # page it will become.
    preview: https://deploy-preview-{{pr}}--poetic-tarsier-d94f11.netlify.app

  media:
    folder: static/uploads
    publicPath: /uploads

  collections:
    - name: projects
      label: Projects
      folder: content/projects
      page: /projects/{{slug}}/
      body: '[data-cms-body]'
      fields:
        - {name: title, label: Title, widget: string, required: true}
        - {name: description, label: Description, widget: string}
    - name: reference
      label: Reference
      folder: content/reference
      page: /reference/{{slug}}/
      body: '[data-cms-body]'
      fields:
        - {name: title, label: Title, widget: string, required: true}
        - {name: description, label: Description, widget: string}
        - {name: date, label: Date, widget: date}
    - name: til
      label: Today I …
      folder: content/til
      page: /til/{{slug}}/
      body: '[data-cms-body]'
      fields:
        - {name: title, label: Title, widget: string, required: true}
        - {name: description, label: Description, widget: string}
        - {name: date, label: Date, widget: date, required: true}
  ```

  `create`/`delete` are left at their default (`false`) on purpose (Decision 2). Check that the `date` widget writes ISO 8601 (`YYYY-MM-DD`). `test/content/frontmatter.test.js` fails a PR otherwise, which is the right place to find out, but confirm it by hand in Task 9.

- [ ] **Step 3:** Tests pass. Commit: `✨ Configure ContentTools for the markdown collections`.

### Task 5: The loader gate, and Barba off for authors

**Files:** `content/_includes/layouts/main.pug`

- [ ] **Step 1: The gate.** Before the existing Barba `script`, add a `script(type='module')`, only `if cmsEntry`, adapted from VFO's layout:
  - `authoring` = `localStorage 'gotrue.user'` set **or** `sessionStorage 'content-tools:github-token'` set **or** `?cms-edit` **or** `#…cms-token=`. Every storage read goes in `try/catch`, as VFO's `stored()` does.
  - `if (authoring) import('/cms/boot.js')`.
  - No footer "Sign in" button. Authors sign in at `/admin/`, which is the same origin, so the Identity session is in `localStorage` for every page afterwards. That keeps the public layout unchanged.

- [ ] **Step 2: Identity emails.** On **every** page, not only entries, load `/js/netlify-identity-widget.js` when `location.hash` matches `/(confirmation|invite|recovery|email_change)_token=/`. Identity's invite and password-reset emails link to the site root with that fragment, and only the widget can finish them. Put this in a small plain `script` in `main.pug`, after the page's scripts.

- [ ] **Step 3: Barba.** Wrap `barba.init({...})` so it doesn't run for an author. Compute the same predicate in the classic inline script (a module script's `const` isn't visible to it). Put one small classic `script` defining `window.cmsAuthoring` above both and have both read it:

  ```js
  // An author gets plain page loads. The in-page editor binds to the entry it
  // booted on, and Barba swaps #container without a load, so an author
  // navigating by transition would be editing a page that is no longer there.
  if (!window.cmsAuthoring) barba.init({ ... });
  ```

  `window.cmsAuthoring` must be defined on **every** page, not only entries: a signed-in author landing on `/til/` (Pug) must not have Barba carry them into a markdown page.

- [ ] **Step 4:** Build. Run `test:content`, `test:html`, `test:links` and `test:a11y`. The existing `output.test.js` check "front-end JS is self-hosted" must still pass: every `src` here is a root-relative path. Commit: `✨ Load the in-page editor for signed-in authors`.

### Task 6: `/admin/`

**Files:** `content/admin/index.pug`

- [ ] **Step 1:** Port VFO `content/admin/index.pug` with:
  - `title: Edit Content | James J Nadeau`, a unique `description:` (`output.test.js` requires one on every non-presentation page, and `frontmatter.test.js` rejects duplicates). Add `eleventyExcludeFromCollections: true`, `permalink: /admin/` and `layout: false`.
  - `link(rel='icon' type='image/png' href='/icons/favicon-32x32.png')`.
  - The same script: `import '/cms/shell.js'`, then `IdentityAdapter` + `gatewayFetch` from `/cms/netlify.js`, and the element created from script so that `auth` and `fetch` are set before it's upgraded. Keep VFO's comment explaining why.

- [ ] **Step 2:** Confirm `/admin/` is outside `test:html:pages`' globs (it is: `_site/*.html`, `til/`, `projects/`, `reference/`) and outside `test/urls.json`. `test:links` doesn't reach it because nothing links to it. Leave all of that as is: the page is an application shell, not content.

- [ ] **Step 3:** Commit: `✨ Add the /admin/ editing screens`.

### Task 7: A browser smoke test, and CI

**Files:** `test/cms/edit.test.js`, `package.json`, `.github/workflows/eleventy-github-pages.yml`

- [ ] **Step 1: Smoke test.** Open `http://127.0.0.1:8080/projects/bosch/?cms-edit` in Puppeteer, signed out, launched the way `test/a11y/axe.test.js` launches it. Assert that the edit bar appears and names `projects/bosch`. Find the bar's host element and how it exposes its text by reading `src/edit/chrome.ts` in the fork at the installed version (it renders into a shadow root). This single request checks what the fork's docs call the four likeliest deployment mistakes: script loaded, lazy chunk loaded, config parsed, page mapped to an entry. It needs no token, because the bar answers before authentication. Also assert that Barba didn't initialise on that page (`?cms-edit` makes `window.cmsAuthoring` true).

  Also assert the negative: `/projects/` (Pug) with `?cms-edit` loads nothing from `/cms/` (collect `page.on('request')` URLs).

- [ ] **Step 2: Scripts.**

  ```json
  "test:cms": "start-server-and-test serve:site http://127.0.0.1:8080 test:cms:run",
  "test:cms:run": "node --test \"test/cms/*.test.js\"",
  ```

  and add `npm run test:cms` to `test` after `test:a11y`.

- [ ] **Step 3: Workflow.** In **both** `build` and `test` jobs:

  ```yaml
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@jamesjnadeau'
      - run: npm ci --omit=dev          # (test job: npm ci)
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```

  In the top-level `permissions:`, add `packages: read` beside `contents: read`, with a one-line comment saying why. Add `- run: npm run test:cms` after `test:a11y`. Check `.github/workflows/external-links.yml` and apply the same change if it installs.

- [ ] **Step 4:** Push the branch and watch the PR's Actions run go green. That's the only real proof Task 0 Step 6 was done. Commit: `✅ Smoke-test the in-page editor in CI`.

### Task 8: Docs

**Files:** `AGENT.md`, `README.md`

- [ ] `AGENT.md`:
  - **Commands:** `NODE_AUTH_TOKEN` must be set before `npm ci` (classic PAT, `read:packages`), with a note on why.
  - **Layout:** rows for `static/cms/`, `static/cms-config.yml`, `content/admin/`, `content/_data/eleventyComputed.js`, `test/cms/`.
  - **Conventions:** the passthrough copy comes from `node_modules/@jamesjnadeau/content-tools`, with the pinned version and how to upgrade (bump, build, `test:cms`, round-trip check). Only `.md` pages in the three folders are editable, and the editable set is decided in `eleventyComputed.js` and the config together, which a test keeps in step. `[data-cms-body]` must hold the rendered body and nothing else.
  - **Gotchas:** Barba is off for authors, and why. Renaming a markdown file changes its entry as well as its URL. An open `cms/<collection>/<slug>` pull request is where that entry's edits live.
  - **Deployment:** already describes both hosts and `netlify.toml` (done with this plan). Add that **editing works only on https://poetic-tarsier-d94f11.netlify.app until the domain moves**, because GitHub Pages has no `/.netlify/` endpoints, and that the Netlify build needs `NODE_AUTH_TOKEN` in its environment.
- [ ] `README.md`: a short "Editing" section, like VFO's. Sign in at `/admin/`, open a page, press the pencil, then **Submit for review** → a pull request.
- [ ] Commit: `📝 Document in-page editing`.

### Task 9: Netlify setup and a real round trip (manual)

Nothing in CI can prove this part: that a real save through a real gateway is a small diff.

- [ ] **Netlify dashboard:** enable Identity. Set registration to **invite only**. Enable **Git Gateway** and connect it to `jamesjnadeau/jamesjnadeau.com`. Invite yourself and accept the email. The link lands on the site root with `#invite_token=`, which Task 5 Step 2 handles.
- [ ] **Old `cms/*` branches:** the repo has `cms/TIL/…` and `cms/Presentations/…` branches from an earlier CMS (2020–21). ContentTools names its branches `cms/<collection>/<slug>` and resets a leftover `cms/` branch with no open PR onto `master`. The names here are lower case (`cms/til/…`) so they don't collide, but delete the old ones if they're dead, so nobody has to wonder whose they are.
- [ ] On `https://poetic-tarsier-d94f11.netlify.app/admin/`: sign in, open **Projects → bosch**, press **Edit**. On the page, press the pencil. Only the post should get hover outlines, not the nav. Change one word in one paragraph and press **Submit for review**.
- [ ] Open the PR. **The diff must be that one paragraph.** Front matter is byte-identical, and the raw `<div><img …></div>` block and the `***` rules are untouched. Commit author is you (from `signed()`), and the PR body says "Submitted by …".
- [ ] Edit a TIL's `date` from the bar and confirm the file gets an ISO date and `test:content` passes on the PR.
- [ ] Confirm the Netlify deploy preview builds (it needs `NODE_AUTH_TOKEN` too). Open the draft from `/admin/` and check it edits on the preview.
- [ ] Merge or close the test PR.

## Out of scope (follow-ups)

- **Pug pages, presentations, new TIL posts** (new TILs are Pug by convention). Pug has no markdown to splice back into.
- **Creating and deleting entries.** Flip `create`/`delete` per collection once editing has proved itself. New files will need `description:` to be unique, which only CI checks.
- **Raw-HTML blocks** (e.g. `bosch.md`'s `<div><img class="img-fluid …"></div>`) are read-only while editing. The fork classifies them as `ContentEdit.Static`, and they round-trip byte for byte. VFO needed `static/cms/site/` to render theirs live, which this site doesn't need yet.
- **Upstreaming `netlify.js`** into the fork (e.g. `@jamesjnadeau/content-tools/netlify`), since two sites now carry the same file. Worth doing when a third appears, or when the copies drift.
- **Switching the domain to Netlify** and retiring the GitHub Pages deploy job. Until then both deploy the same build, and only the Netlify one can edit.
