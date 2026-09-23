// Smoke test for the Pug editor at /admin/pug/, signed out. Expects a server
// already running at TEST_BASE_URL (see the `test:cms` npm script).
//
// Signed out it can't reach the repository, but everything that fails only in
// a browser can still be checked: the esbuild bundle loads (Pug's compiler
// was written for Node, and a missing shim breaks it at import), the sign-in
// gate comes up, and the preview renders a post the way the build did. The
// last is what an author trusts before submitting, so it is checked against
// every Pug post the editor offers.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import puppeteer from 'puppeteer';

const BASE = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:8080';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
after(() => browser.close());

async function open() {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}/admin/pug/`, { waitUntil: 'networkidle0' });
  return { page, errors };
}

// The posts the editor lists (static/cms-pug-config.yml): each folder's Pug
// files except index.pug.
const posts = ['til', 'reference', 'projects'].flatMap((dir) => readdirSync(`content/${dir}`)
  .filter((f) => f.endsWith('.pug') && f !== 'index.pug')
  .map((f) => ({ url: `/${dir}/${f.slice(0, -'.pug'.length)}/`, file: `content/${dir}/${f}` })));

test('signed out, /admin/pug/ loads its bundle and asks the author to sign in', async () => {
  const { page, errors } = await open();
  try {
    assert.deepEqual(errors, []);
    assert.equal(await page.$eval('#gate', (e) => e.hidden), false);
    assert.equal(await page.$eval('#app', (e) => e.hidden), true);
    assert.equal(await page.evaluate(() => typeof window.pugEditor?.render), 'function');
  } finally {
    await page.close();
  }
});

// Compared as parsed DOM with whitespace collapsed: Eleventy's Pug and the
// bundled one agree on markup, not on where they put newlines.
test('the preview renders every Pug post as the build did', async () => {
  const { page } = await open();
  try {
    const bad = [];
    for (const { url, file } of posts) {
      const [got, want] = await page.evaluate(async (source, url) => {
        const template = document.createElement('template');
        template.innerHTML = window.pugEditor.render(source, url).html;
        const built = new DOMParser().parseFromString(await (await fetch(url)).text(), 'text/html');
        return [template.innerHTML, built.getElementById('container').innerHTML];
      }, readFileSync(file, 'utf8'), url);
      const norm = (html) => html.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
      if (norm(got) !== norm(want)) bad.push(url);
    }
    assert.ok(posts.length > 20, `only ${posts.length} Pug posts`);
    assert.deepEqual(bad, []);
  } finally {
    await page.close();
  }
});

// The preview is the published page with the post swapped in, so an edit
// shows in the site's own layout; a Pug error is shown, and the last good
// render stays.
test('an edit shows in the published page, and a Pug error is reported', async () => {
  const { page, errors } = await open();
  try {
    const url = posts[0].url;
    await page.evaluate((url) => window.pugEditor.preview(url, 'p Hello #[strong there]'), url);
    const frame = page.frames().find((f) => f !== page.mainFrame());
    assert.equal(await frame.$eval('#container', (e) => e.innerHTML), '<p>Hello <strong>there</strong></p>');
    assert.ok(await frame.$('#header'), 'the site layout is around it');

    await page.evaluate((url) => window.pugEditor.preview(url, 'p ok\n  #{oops'), url);
    await page.waitForSelector('#preview-error:not([hidden])', { timeout: 5000 });
    assert.match(await page.$eval('#preview-error', (e) => e.textContent), /post\.pug:2/);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});
