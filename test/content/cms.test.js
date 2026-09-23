// Asserts the ContentTools editor is wired to this site: the package's files
// are served whole from /cms/, the config agrees with the content and with the
// pages the build wrote, and the Netlify glue routes GitHub calls through Git
// Gateway. Also the Pug editor's config and bundle (/admin/pug/). Requires
// `npm run build` first, like output.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';
import { parseConfig, entryForUrl, entryPath, findCollection, pagePath, TOKEN_KEY as PACKAGE_TOKEN_KEY } from '@jamesjnadeau/content-tools/cms';

const SITE = '_site';
const PACKAGE = 'node_modules/@jamesjnadeau/content-tools/dist';

// Read the way the editor reads it, then validated by the package itself,
// which names the offending path in a ConfigError.
const RAW = matter(`---\n${readFileSync('static/cms-config.yml', 'utf8')}\n---\n`).data;
const CONFIG = parseConfig(RAW);

if (!existsSync(SITE)) {
  throw new Error(`${SITE}/ not found — run \`npm run build\` before these tests`);
}

// --- the package, served from /cms/ ---------------------------------------

// Chunk names are content-hashed, so a partial copy 404s on an import only
// when an author opens the editor, which is long after anybody is looking.
test('every chunk the editor imports is served', () => {
  const files = ['edit.js', 'shell.js', ...readdirSync(`${SITE}/cms/chunks`).map((f) => `chunks/${f}`)];
  const missing = files.flatMap((file) => {
    const dir = new URL(`${file.includes('/') ? 'chunks/' : ''}`, `file://${process.cwd()}/${SITE}/cms/`);
    const src = readFileSync(`${SITE}/cms/${file}`, 'utf8');
    return [...src.matchAll(/(?:from|import\()\s*["'](\.{1,2}\/[^"']+)["']/g)]
      .map(([, rel]) => new URL(rel, dir).pathname)
      .filter((abs) => !existsSync(abs))
      .map((abs) => `${file} imports ${abs}`);
  });
  assert.deepEqual(missing, []);
  // edit.js links these relative to itself. Without icons.woff every tool in
  // the toolbox renders as a tofu box, with nothing in the console.
  for (const file of ['content-tools-content.min.css', 'images/icons.woff']) {
    assert.ok(existsSync(`${SITE}/cms/${file}`), `${SITE}/cms/${file}`);
  }
});

// PurgeCSS runs over _site/**/*.css in production and would strip every editor
// rule, because no page's HTML uses them until the editor starts. The failure
// is silent: no hover outlines, no drop indicators.
test('the editor stylesheet is served exactly as the package ships it', () => {
  const shipped = readFileSync(`${PACKAGE}/content-tools-content.min.css`);
  assert.ok(readFileSync(`${SITE}/cms/content-tools-content.min.css`).equals(shipped));
});

// --- which pages are entries ------------------------------------------------

const { default: computed } = await import('../../content/_data/eleventyComputed.js');
const FOLDERS = RAW.collections.map((c) => c.name);

// The collections are the folders the pages call entries, and the folder
// names are the collection names, so "projects/bosch" means the same thing on
// the page and in the config.
test('the config edits exactly the folders whose pages declare themselves entries', () => {
  assert.deepEqual(RAW.collections.map((c) => c.folder), FOLDERS.map((dir) => `content/${dir}`));
  const claimed = ['projects', 'reference', 'til', 'presentations', 'styles']
    .filter((dir) => computed.cmsEntry({ page: { inputPath: `./content/${dir}/x.md` } }) !== null);
  assert.deepEqual(claimed, FOLDERS);
  assert.equal(computed.cmsEntry({ page: { inputPath: './content/til/x.pug' } }), null);
  assert.equal(computed.cmsEntry({ page: { inputPath: './content/til/deeper/x.md' } }), null);
});

const markdown = FOLDERS.flatMap((dir) => readdirSync(`content/${dir}`)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ dir, slug: f.slice(0, -'.md'.length) })));

const built = (url) => readFileSync(`${SITE}${url}index.html`, 'utf8');

test('there are markdown pages to edit', () => {
  assert.ok(markdown.length > 40, `only ${markdown.length} markdown pages`);
});

// The slug is the file name verbatim: TIL URLs keep their date prefix here,
// and garden.org.md and Jupyter.md keep their dots and case.
test('every markdown page says which entry it is, and holds its body in one element', () => {
  const bad = markdown.flatMap(({ dir, slug }) => {
    const url = `/${dir}/${slug}/`;
    if (!existsSync(`${SITE}${url}index.html`)) return [`${url}: not built`];
    const html = built(url);
    const errs = [];
    if (!html.includes(`<meta name="cms:entry" content="${dir}/${slug}">`)) errs.push(`${url}: no cms:entry meta`);
    if (html.split('data-cms-body').length !== 2) errs.push(`${url}: not exactly one data-cms-body`);
    return errs;
  });
  assert.deepEqual(bad, []);
});

// A Pug page that declared itself would send a signed-in author's editor off
// to read a .md file that doesn't exist.
test('no Pug page claims to be an entry', () => {
  const pug = ['/', '/projects/', '/reference/', '/til/', '/presentations/',
    ...['til', 'reference'].flatMap((dir) => readdirSync(`content/${dir}`)
      .filter((f) => f.endsWith('.pug') && f !== 'index.pug')
      .map((f) => `/${dir}/${f.slice(0, -'.pug'.length)}/`))];
  const bad = pug.filter((url) => /cms:entry|data-cms-body/.test(built(url)));
  assert.deepEqual(bad, []);
});

// --- the config -------------------------------------------------------------

// /admin/ builds each entry's Edit link from `page:`, and the editor reads and
// writes the file `folder` + slug names. Both directions have to land on the
// page Eleventy actually built from that file.
test('every markdown page maps to its own file and back', () => {
  const bad = markdown.flatMap(({ dir, slug }) => {
    const url = `https://poetic-tarsier-d94f11.netlify.app/${dir}/${slug}/`;
    const found = entryForUrl(CONFIG, url);
    if (found?.collection !== dir || found?.slug !== slug) return [`${url} -> ${JSON.stringify(found)}`];
    const file = entryPath(findCollection(CONFIG, dir), slug);
    return file === `content/${dir}/${slug}.md` ? [] : [`${dir}/${slug} -> ${file}`];
  });
  assert.deepEqual(bad, []);
});

// Front matter keys are lower case site-wide (frontmatter.test.js), and a
// field the files don't use is a field the editor would start adding to them.
test('the fields are the front matter keys the files use', () => {
  for (const collection of RAW.collections) {
    const used = new Set(markdown.filter((m) => m.dir === collection.name)
      .flatMap(({ dir, slug }) => Object.keys(matter(readFileSync(`content/${dir}/${slug}.md`, 'utf8')).data)));
    assert.deepEqual(collection.fields.map((f) => f.name).sort(), [...used].sort(), collection.name);
  }
});

// Nothing to add or remove pages with yet: new pages are written by hand.
test('the editor can change pages but not create or delete them', () => {
  assert.deepEqual(RAW.collections.filter((c) => c.create || c.delete).map((c) => c.name), []);
});

// --- the Netlify glue (static/cms/) ------------------------------------------

// The glue is copied into the same folder as the package's dist/. A file of
// the same name in a future release would silently replace ours, or ours it.
test('the site glue shares no name with the package', () => {
  const shipped = new Set(readdirSync(PACKAGE));
  assert.deepEqual(readdirSync('static/cms').filter((f) => shipped.has(f)), []);
});

// The glue reroutes calls for one repository and branch; a config pointed
// anywhere else would go straight to api.github.com with a Netlify JWT.
test('the Git Gateway glue and the config name the same repository', () => {
  const glue = readFileSync('static/cms/netlify.js', 'utf8');
  assert.equal(glue.match(/const REPO = '([^']+)'/)[1], RAW.backend.repo);
  assert.equal(glue.match(/const BRANCH = '([^']+)'/)[1], RAW.backend.branch);
});

// The glue files the Identity JWT under the key edit.js looks for, and edit.js
// only wakes up when that key holds something. The glue can't import it (edit.js
// would come with it, for every page), so it spells it out; this is the check.
test('the glue files tokens where the editor looks for them', async () => {
  const { TOKEN_KEY } = await import('../../static/cms/netlify.js');
  assert.equal(TOKEN_KEY, PACKAGE_TOKEN_KEY);
});

// --- gatewayFetch --------------------------------------------------------

async function gateway() {
  const calls = [];
  globalThis.window = {
    fetch: async (url, init) => {
      calls.push({ url, init });
      return new Response('[]');
    },
  };
  const { gatewayFetch } = await import('../../static/cms/netlify.js');
  return { fetch: gatewayFetch(), calls };
}

test('repository API calls go to the Git Gateway, with the rest of the path', async () => {
  const { fetch, calls } = await gateway();
  const repo = `https://api.github.com/repos/${RAW.backend.repo}`;
  await fetch(`${repo}/contents/content%2Fprojects?ref=master`, {
    headers: { Authorization: 'Bearer handed-over', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  await fetch(`${repo}/git/blobs`, { method: 'POST', body: '{}' });
  await fetch('https://api.github.com/repositories/123/pulls?state=open&page=2');

  assert.deepEqual(calls.map((c) => c.url), [
    '/.netlify/git/github/contents/content%2Fprojects?ref=master',
    '/.netlify/git/github/git/blobs',
    '/.netlify/git/github/pulls?state=open&page=2',
  ]);
  // With no Identity session in this browser, the token already on the
  // request (handed over from /admin/) is left alone.
  assert.equal(calls[0].init.headers.get('Authorization'), 'Bearer handed-over');
  assert.equal(calls[0].init.headers.has('X-GitHub-Api-Version'), false);
  assert.equal(calls[1].init.method, 'POST');
});

// The gateway does not proxy the repository's own metadata, which the admin
// screens read once at sign-in to check the author may push.
test('repository metadata is answered locally', async () => {
  const { fetch, calls } = await gateway();
  const response = await fetch(`https://api.github.com/repos/${RAW.backend.repo}`);
  assert.deepEqual(await response.json(), {
    default_branch: RAW.backend.branch,
    permissions: { push: true },
  });
  assert.deepEqual(calls, []);
});

test('everything else is fetched untouched', async () => {
  const { fetch, calls } = await gateway();
  await fetch('/cms-config.yml');
  await fetch('https://api.github.com/repos/someone/else/contents/x');
  assert.deepEqual(calls.map((c) => c.url), [
    '/cms-config.yml',
    'https://api.github.com/repos/someone/else/contents/x',
  ]);
});

// Every change reaches GitHub as the Git Gateway's one account, so the glue
// names the signed-in editor on the pull request and as each commit's author.
test('pull requests and commits name the signed-in editor', async () => {
  const { fetch, calls } = await gateway();
  globalThis.window.netlifyIdentity = {
    currentUser: () => ({
      email: 'author@example.com',
      user_metadata: { full_name: 'Pat Author' },
      jwt: async () => 'fresh-jwt',
    }),
  };
  globalThis.localStorage = { getItem: () => '{}' };
  try {
    const repo = `https://api.github.com/repos/${RAW.backend.repo}`;
    const post = (rest, body) => fetch(`${repo}${rest}`, { method: 'POST', body: JSON.stringify(body) });
    await post('/pulls', { title: 'Update projects/x', body: '', head: 'cms/x', base: 'master' });
    await post('/git/commits', { message: 'Update projects/x', tree: 't', parents: ['p'] });
    await post('/git/blobs', { content: 'x' });

    const [pull, commit, blob] = calls.map((c) => JSON.parse(c.init.body));
    assert.equal(pull.body, 'Submitted by Pat Author (author@example.com) through the site editor.');
    assert.equal(pull.title, 'Update projects/x');
    assert.equal(commit.author.name, 'Pat Author');
    assert.equal(commit.author.email, 'author@example.com');
    assert.equal(commit.message, 'Update projects/x');
    assert.deepEqual(blob, { content: 'x' });
    assert.equal(calls[0].init.headers.get('Authorization'), 'Bearer fresh-jwt');
  } finally {
    delete globalThis.localStorage;
  }
});

// --- fileSessionToken ----------------------------------------------------

function storage(entries = {}) {
  const map = new Map(Object.entries(entries));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    has: (k) => map.has(k),
  };
}

async function fileWith({ user, session }) {
  globalThis.window ??= {};
  globalThis.window.netlifyIdentity ??= {};
  const { identity, fileSessionToken } = await import('../../static/cms/netlify.js');
  // The widget is loaded once and kept, so it is the kept one that answers.
  (await identity()).currentUser = () => user;
  globalThis.localStorage = storage(user ? { 'gotrue.user': '{}' } : {});
  globalThis.sessionStorage = session;
  try {
    await fileSessionToken();
  } finally {
    delete globalThis.localStorage;
    delete globalThis.sessionStorage;
  }
}

test('a signed-in author has their JWT filed for the in-page editor', async () => {
  const { TOKEN_KEY } = await import('../../static/cms/netlify.js');
  const session = storage();
  await fileWith({ user: { jwt: async () => 'jwt' }, session });
  assert.equal(session.getItem(TOKEN_KEY), 'jwt');
});

// Signing out reloads the page; a JWT still filed from the session that
// ended would bring the editor straight back up.
test('signing out takes back the token the session filed', async () => {
  const { TOKEN_KEY } = await import('../../static/cms/netlify.js');
  const session = storage();
  await fileWith({ user: { jwt: async () => 'jwt' }, session });
  await fileWith({ user: null, session });
  assert.equal(session.has(TOKEN_KEY), false);
});

// A deploy preview opened from /admin/ has no session of its own; the token
// handed across is the only one it has, and must stay.
test('a token handed over from /admin/ outlives having no session', async () => {
  const { TOKEN_KEY } = await import('../../static/cms/netlify.js');
  const session = storage({ [TOKEN_KEY]: 'handed-over' });
  await fileWith({ user: null, session });
  assert.equal(session.getItem(TOKEN_KEY), 'handed-over');
});

// --- the Pug editor (/admin/pug/) --------------------------------------------

const PUG_RAW = matter(`---\n${readFileSync('static/cms-pug-config.yml', 'utf8')}\n---\n`).data;
const PUG_CONFIG = parseConfig(PUG_RAW);

// Both editors write to the one repository through the one gateway, and a
// draft is opened on the same deploy previews.
test('the Pug editor edits the same repository as the markdown editor', () => {
  assert.deepEqual(PUG_RAW.backend, RAW.backend);
  assert.deepEqual(PUG_RAW.site, RAW.site);
});

// Each editor's screens skip pull requests for collections it doesn't have.
// Sharing a name would put a Pug post's draft in the markdown screens, which
// would try to edit it as markdown, and the reverse.
test('the Pug collections are named apart from the markdown ones', () => {
  const markdownNames = new Set(RAW.collections.map((c) => c.name));
  assert.deepEqual(PUG_RAW.collections.filter((c) => markdownNames.has(c.name)).map((c) => c.name), []);
  assert.deepEqual(PUG_RAW.collections.filter((c) => c.create || c.delete).map((c) => c.name), []);
});

// The editor opens the file `folder` + slug + `.pug` names and previews the
// page `page:` names; both have to be the ones Eleventy built from it.
test('every Pug post maps to its own file and page', () => {
  const bad = PUG_CONFIG.collections.flatMap((collection) => {
    const dir = collection.folder.replace(/^content\//, '');
    return readdirSync(collection.folder)
      .filter((f) => f.endsWith('.pug') && f !== 'index.pug')
      .flatMap((f) => {
        const slug = f.slice(0, -'.pug'.length);
        const url = `/${dir}/${slug}/`;
        const errs = [];
        if (entryPath(collection, slug) !== `${collection.folder}/${f}`) errs.push(`${slug}: wrong file`);
        if (pagePath(PUG_CONFIG, collection, slug) !== url) errs.push(`${slug}: wrong page`);
        if (!existsSync(`${SITE}${url}index.html`)) errs.push(`${url}: not built`);
        return errs;
      });
  });
  assert.deepEqual(bad, []);
});

// Bundled at build time rather than copied, so it only exists if the build's
// esbuild step ran. It imports the site glue from /cms/ at runtime.
test('the Pug editor is built, and what it imports is served', () => {
  const bundle = readFileSync(`${SITE}/cms-pug/pug-editor.js`, 'utf8');
  assert.ok(existsSync(`${SITE}/admin/pug/index.html`));
  assert.ok(existsSync(`${SITE}/cms-pug-config.yml`));
  // The statements esbuild writes for what it left external. Looser patterns
  // match example code in the error messages of Pug's bundled JS parser.
  const imports = [...bundle.matchAll(/\bimport\s*\{[\w\s,$]*\}\s*from\s*["']([^"']+)["']/g)].map(([, spec]) => spec);
  assert.deepEqual([...new Set(imports)], ['/cms/netlify.js']);
  assert.ok(existsSync(`${SITE}/cms/netlify.js`));
});
