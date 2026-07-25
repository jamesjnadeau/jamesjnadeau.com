// Asserts invariants about the built site. Requires `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const SITE = '_site';

if (!existsSync(SITE)) {
  throw new Error(`${SITE}/ not found — run \`npm run build\` before these tests`);
}

const html = readdirSync(SITE, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.join(SITE, f));

const read = (f) => readFileSync(f, 'utf8');

// Third-party pages copied verbatim from `static/` aren't ours to validate.
const OURS = html.filter((f) => !/_site\/(ski-free|wind|graph|impress)\//.test(f));

test('build produced the expected number of pages', () => {
  assert.ok(html.length > 90, `only ${html.length} html files in ${SITE}/`);
});

test('no page renders "Invalid Date" or a bare undefined', () => {
  const bad = OURS.filter((f) => /Invalid Date|>undefined</.test(read(f)));
  assert.deepEqual(bad, []);
});

test('every page has <html lang> and a non-empty <title>', () => {
  const bad = OURS.flatMap((f) => {
    const s = read(f);
    const errs = [];
    if (!/<html[^>]+lang=/.test(s)) errs.push(`${f}: missing <html lang>`);
    if (!/<title>[^<]+<\/title>/.test(s)) errs.push(`${f}: missing or empty <title>`);
    return errs;
  });
  assert.deepEqual(bad, []);
});

test('content pages emit a meta description', () => {
  const bad = OURS
    .filter((f) => !f.includes('/presentations/'))
    .filter((f) => !/<meta name="description" content="[^"]+"/.test(read(f)));
  assert.deepEqual(bad, []);
});

test('front-end JS is self-hosted, not loaded from a CDN', () => {
  const bad = OURS.filter((f) => /<script[^>]+src="https?:\/\//.test(read(f)));
  assert.deepEqual(bad, []);
});

test('the TIL feed excludes the TIL index and matches the index order', () => {
  const rss = read(path.join(SITE, 'til', 'rss.xml'));
  const feed = [...rss.matchAll(/<link>https:\/\/jamesjnadeau\.com(\/til\/[^<]+)<\/link>/g)]
    .map((m) => m[1]);

  assert.ok(!feed.includes('/til/'), 'the TIL index must not appear in its own feed');
  assert.ok(feed.length > 0, 'feed has no items');

  const index = read(path.join(SITE, 'til', 'index.html'));
  const listed = [...index.matchAll(/href="(\/til\/[^"]+\/)"/g)].map((m) => m[1]);

  assert.deepEqual(
    feed,
    listed.slice(0, feed.length),
    'RSS order diverges from the /til/ index order',
  );
});
