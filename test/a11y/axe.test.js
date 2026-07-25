// Accessibility scan. Expects a server already running at TEST_BASE_URL
// (see the `test:a11y` npm script, which wires up start-server-and-test).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const urls = JSON.parse(readFileSync(new URL('../urls.json', import.meta.url), 'utf8'));
const BASE = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:8080';

// Known-failing rules, waived per URL pattern. Shrink this list; don't grow it.
// Each entry needs a reason — an unexplained waiver is indistinguishable from a
// bug someone gave up on.
const WAIVERS = [
  {
    // impress.js rewrites the viewport meta at runtime to lock scaling while it
    // drives its own CSS transforms. Not fixable without forking the library.
    match: /^\/presentations\//,
    rules: ['meta-viewport'],
  },
];

function waivedFor(url) {
  return new Set(WAIVERS.filter((w) => w.match.test(url)).flatMap((w) => w.rules));
}

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
after(() => browser.close());

for (const url of urls) {
  test(`a11y: ${url}`, async () => {
    const page = await browser.newPage();
    try {
      await page.goto(BASE + url, { waitUntil: 'networkidle0' });
      const { violations } = await new AxePuppeteer(page)
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const waived = waivedFor(url);
      const blocking = violations
        .filter((v) => !waived.has(v.id))
        .map((v) => `${v.id} (${v.nodes.length}×): ${v.help}`);

      assert.deepEqual(blocking, []);
    } finally {
      await page.close();
    }
  });
}
