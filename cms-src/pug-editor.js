// The Pug editor at /admin/pug/ (content/admin/pug.pug): a post's source on
// one side, the page it becomes on the other, and a pull request on save.
//
// ContentTools edits the markdown pages in place, but it can only edit
// markdown: a Pug post has no markdown to splice words back into. So Pug
// posts get a code editor instead, built from the same pieces the markdown
// editor stands on:
//
// - ContentTools' git layer (`@jamesjnadeau/content-tools/cms`), which reads
//   a file from the repository and saves it as a `cms/<collection>/<slug>`
//   branch and pull request. It never looks inside the file, so a Pug post
//   round-trips byte for byte: what is in the editor is what is committed.
// - The site's Netlify Identity + Git Gateway glue (static/cms/netlify.js),
//   imported at runtime from /cms/ rather than bundled, so /admin/ and this
//   page share one copy and one sign-in.
//
// Its collections are its own (static/cms-pug-config.yml), named `til-pug`
// and so on. The markdown screens at /admin/ skip pull requests for
// collections they don't have, and this page skips theirs, so the two never
// offer each other's drafts.
//
// Bundled by esbuild into _site/cms-pug/ (see .eleventy.js); this file is
// not served as it is.

import { EditorView, basicSetup } from 'codemirror';
import { StreamLanguage } from '@codemirror/language';
import { pug as pugMode } from '@codemirror/legacy-modes/mode/pug';
import { CmsRepo, ConflictError, findCollection, loadConfig, pagePath, previewOrigin }
  from '@jamesjnadeau/content-tools/cms';
import pug from 'pug';
import { load as parseYaml } from 'js-yaml';
import { IdentityAdapter, gatewayFetch } from '/cms/netlify.js';

const CONFIG = '/cms-pug-config.yml';
const PREVIEW_DELAY = 250;

const $ = (selector) => document.querySelector(selector);
const ui = {
  gate: $('#gate'),
  signIn: $('#sign-in'),
  gateStatus: $('#gate-status'),
  signOut: $('#sign-out'),
  app: $('#app'),
  picker: $('#entry'),
  code: $('#code'),
  frame: $('#preview'),
  error: $('#preview-error'),
  save: $('#save'),
  status: $('#status'),
  links: $('#links'),
};

// --- Preview ---------------------------------------------------------------

// A post's front matter and its Pug, apart. Eleventy reads the same `---`
// block; only its data reaches the template, as locals.
export function split(source) {
  const found = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(source);
  if (!found) return { data: {}, body: source };
  const data = parseYaml(found[1]) ?? {};
  return { data: typeof data === 'object' ? data : {}, body: source.slice(found[0].length) };
}

// The post's HTML, as Eleventy would render its body. Only the post's own
// front matter is in scope: collections and the rest of Eleventy's data
// cascade aren't here, which is why index pages aren't offered.
export function render(source, url) {
  const { data, body } = split(source);
  const html = pug.compile(body, { filename: 'post.pug' })({ ...data, page: { url } })
    // The build's `focusableCodeBlocks` transform (.eleventy.js), so a code
    // block previews as it will publish.
    .replace(/<pre(?![^>]*\btabindex=)/g, '<pre tabindex="0"');
  return { html, title: typeof data.title === 'string' ? data.title : null };
}

// The preview is the published page itself, loaded same-origin in the
// frame, with its post swapped for the one being edited. So it has the real
// layout, nav and stylesheet without this page restating any of them.
// `main.pug` puts a non-entry page's body straight into #container.
function show(source) {
  const doc = ui.frame.contentDocument;
  const container = doc?.getElementById('container');
  if (!container) return;
  try {
    const { html, title } = render(source, state.url);
    container.innerHTML = html;
    if (title) doc.title = title;
    ui.error.hidden = true;
  } catch (error) {
    // The last good render stays up, so a half-typed line doesn't blank it.
    ui.error.textContent = error.message;
    ui.error.hidden = false;
  }
}

let pending;
function schedule() {
  clearTimeout(pending);
  pending = setTimeout(() => show(editor.state.doc.toString()), PREVIEW_DELAY);
}

// Loads `url` into the frame and renders `source` into it once it's there.
function preview(url, source) {
  return new Promise((resolve) => {
    ui.frame.onload = () => {
      ui.frame.onload = null;
      show(source);
      resolve();
    };
    ui.frame.src = url;
  });
}

// --- Editor ----------------------------------------------------------------

const state = {
  repo: null,
  config: null,
  collection: null,
  slug: null,
  url: null,
  saved: '',
  parent: null,
  pull: null,
};

const editor = new EditorView({
  parent: ui.code,
  extensions: [
    basicSetup,
    StreamLanguage.define(pugMode),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return;
      schedule();
      describe();
    }),
  ],
});

function dirty() {
  return state.slug !== null && editor.state.doc.toString() !== state.saved;
}

function setText(text) {
  editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } });
}

function describe(message) {
  ui.status.textContent = message ?? (state.slug === null ? ''
    : dirty() ? 'Unsaved changes' : state.pull ? `In review as #${state.pull.number}` : 'Published');
  ui.save.disabled = !dirty();

  ui.links.replaceChildren();
  if (state.slug === null) return;
  const link = (href, text) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.target = '_blank';
    a.rel = 'noopener';
    ui.links.append(a);
  };
  link(state.url, 'Live page');
  if (state.pull) {
    link(state.pull.html_url, `Pull request #${state.pull.number}`);
    const origin = previewOrigin(state.config, state.pull.number);
    if (origin) link(`${origin}${state.url}`, 'Deploy preview');
  }
}

// --- Entries ---------------------------------------------------------------

async function listEntries() {
  const inFlight = new Map((await state.repo.listInFlight())
    .map((e) => [`${e.collection}/${e.slug}`, e.pull]));
  ui.picker.replaceChildren(new Option('Choose a post…', ''));
  for (const collection of state.config.collections) {
    const group = document.createElement('optgroup');
    group.label = collection.label;
    const { entries } = await state.repo.listEntries(collection.name);
    // A section's index.pug lists the section, from Eleventy data this page
    // can't render; it isn't a post.
    for (const { slug } of entries.filter((e) => e.slug !== 'index')) {
      const key = `${collection.name}/${slug}`;
      const label = inFlight.has(key) ? `${slug} (in review)` : slug;
      group.append(new Option(label, key));
    }
    if (group.children.length) ui.picker.append(group);
  }
}

async function open(key) {
  const [name, slug] = key.split('/');
  const collection = findCollection(state.config, name);
  if (!collection || !slug) return;
  ui.picker.value = key;
  describe('Loading…');

  const entry = await state.repo.readEntry(name, slug);
  Object.assign(state, {
    collection: name,
    slug,
    url: pagePath(state.config, collection, slug),
    saved: entry.content ?? '',
    parent: entry.commit,
    pull: entry.pull,
  });
  setText(state.saved);
  history.replaceState(null, '', `#/${key}`);
  describe();
  await preview(state.url, state.saved);
}

async function save() {
  const content = editor.state.doc.toString();
  ui.save.disabled = true;
  describe('Saving…');
  try {
    const result = await state.repo.saveEntry(state.collection, state.slug, {
      content,
      parent: state.parent,
      message: `Update ${state.collection.replace(/-pug$/, '')}/${state.slug}`,
    });
    Object.assign(state, {
      saved: content,
      parent: result.commit ?? state.parent,
      pull: result.pull,
    });
    describe();
  } catch (error) {
    if (error instanceof ConflictError) {
      describe('Someone else changed this post since you opened it. Copy your changes, then reload it.');
    } else {
      describe(`Not saved: ${error.message}`);
    }
    ui.save.disabled = false;
  }
}

// --- Sign-in ---------------------------------------------------------------

async function start(auth) {
  const fetch = gatewayFetch();
  state.config = await loadConfig(CONFIG, { fetch });
  state.repo = new CmsRepo({ config: state.config, token: () => auth.currentToken(), fetch });
  ui.gate.hidden = true;
  ui.app.hidden = false;
  ui.signOut.hidden = false;
  await listEntries();
  const key = decodeURIComponent(location.hash.replace(/^#\//, ''));
  // A link to a post that has since been renamed is a message, not a reason
  // to send the author back to the sign-in screen.
  if (key) await open(key).catch((e) => describe(e.message));
}

async function boot() {
  const auth = new IdentityAdapter();
  await auth.resume();

  ui.signIn.onclick = async () => {
    try {
      await auth.authenticate();
      await start(auth);
    } catch (error) {
      ui.gateStatus.textContent = error.message;
    }
  };
  ui.signOut.onclick = async () => {
    await auth.logout();
    location.reload();
  };
  ui.picker.onchange = () => {
    if (dirty() && !confirm('Discard your unsaved changes?')) {
      ui.picker.value = `${state.collection}/${state.slug}`;
      return;
    }
    if (ui.picker.value) open(ui.picker.value).catch((e) => describe(e.message));
  };
  ui.save.onclick = save;
  window.addEventListener('beforeunload', (event) => {
    if (dirty()) event.preventDefault();
  });

  if (auth.currentToken()) await start(auth);
  else ui.gate.hidden = false;
}

// For test/cms/pug.test.js and the browser console: render Pug into the
// preview without signing in or reading the repository.
window.pugEditor = {
  render,
  preview: (url, source) => {
    state.url = url;
    setText(source);
    return preview(url, source);
  },
};

boot().catch((error) => {
  ui.app.hidden = true;
  ui.gate.hidden = false;
  ui.gateStatus.textContent = error.message;
});
