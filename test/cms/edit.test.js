// Smoke test for the in-page editor, signed out. Expects a server already
// running at TEST_BASE_URL (see the `test:cms` npm script, which wires up
// start-server-and-test).
//
// One signed-out request with ?cms-edit checks the deployment mistakes that
// fail nowhere else: the loader ran, edit.js and the lazy chunk behind it
// loaded, /cms-config.yml parsed, and the page mapped to its entry. The bar
// answers before anybody signs in, so no token is needed.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

const BASE = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:8080';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
after(() => browser.close());

async function open(path) {
  const page = await browser.newPage();
  // Records whether the page started Barba, by wrapping `init` on whatever
  // the UMD bundle assigns to window.barba.
  await page.evaluateOnNewDocument(() => {
    let barba;
    Object.defineProperty(window, 'barba', {
      configurable: true,
      get: () => barba,
      set(value) {
        const init = value.init;
        value.init = function (...args) {
          window.barbaStarted = true;
          return init.apply(this, args);
        };
        barba = value;
      },
    });
  });
  const requests = [];
  const errors = [];
  page.on('request', (r) => requests.push(new URL(r.url()).pathname));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE + path, { waitUntil: 'networkidle0' });
  return { page, requests, errors };
}

// The bar's text, from the shadow root the editor draws it in.
const barText = (page) => page.$eval('content-tools-edit-bar',
  (bar) => bar.shadowRoot.textContent.replace(/\s+/g, ' ').trim());

test('a markdown page with ?cms-edit puts the edit bar up, naming its entry', async () => {
  const { page, errors } = await open('/projects/bosch/?cms-edit');
  try {
    await page.waitForSelector('content-tools-edit-bar', { timeout: 10000 });
    const text = await barText(page);
    assert.match(text, /projects\/bosch/);
    assert.match(text, /Sign in through the admin screens/);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
});

// Barba swaps #container without a page load, and the editor is bound to the
// page it started on.
test('an author gets no Barba page transitions', async () => {
  const { page } = await open('/projects/bosch/?cms-edit');
  try {
    assert.equal(await page.evaluate(() => window.cmsAuthoring), true);
    assert.equal(await page.evaluate(() => window.barbaStarted ?? false), false);
  } finally {
    await page.close();
  }
});

test('a reader on a markdown page loads nothing from /cms/', async () => {
  const { page, requests } = await open('/projects/bosch/');
  try {
    assert.equal(await page.evaluate(() => window.cmsAuthoring), false);
    assert.equal(await page.evaluate(() => window.barbaStarted), true, 'readers keep their transitions');
    assert.deepEqual(requests.filter((p) => p.startsWith('/cms')), []);
  } finally {
    await page.close();
  }
});

// A Pug page isn't an entry. Even an author asking for the editor on one gets
// nothing: loading it would only put up an error.
test('a Pug page with ?cms-edit loads nothing from /cms/', async () => {
  const { page, requests } = await open('/projects/?cms-edit');
  try {
    assert.deepEqual(requests.filter((p) => p.startsWith('/cms')), []);
    assert.equal(await page.$('content-tools-edit-bar'), null);
  } finally {
    await page.close();
  }
});
