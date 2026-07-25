// Asserts invariants about the source front matter that a generic HTML validator
// can't know about. Runs against `content/`, so it needs no build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const CONTENT = fileURLToPath(new URL('../../content/', import.meta.url));

function pages(dir) {
  return readdirSync(path.join(CONTENT, dir))
    .filter((f) => /\.(pug|md)$/.test(f))
    .map((f) => ({
      name: f,
      rel: `content/${dir}/${f}`,
      ...matter(readFileSync(path.join(CONTENT, dir, f), 'utf8')),
    }));
}

const SECTIONS = ['til', 'projects', 'reference', 'presentations'];
const ALL = SECTIONS.flatMap(pages);
const TIL = pages('til').filter((p) => p.name !== 'index.pug');

// `eleventyNavigation` and `eleventyExcludeFromCollections` are Eleventy's own
// camelCase keys; everything we author should be lower case.
const ELEVENTY_KEYS = new Set(['eleventyNavigation', 'eleventyExcludeFromCollections']);

test('front matter keys are lower case', () => {
  const bad = ALL.flatMap((p) =>
    Object.keys(p.data)
      .filter((k) => !ELEVENTY_KEYS.has(k) && k !== k.toLowerCase())
      .map((k) => `${p.rel}: "${k}" should be "${k.toLowerCase()}"`));
  assert.deepEqual(bad, []);
});

test('every page has a title', () => {
  assert.deepEqual(ALL.filter((p) => !p.data.title).map((p) => p.rel), []);
});

test('every TIL post has a parseable date', () => {
  const bad = TIL
    .filter((p) => p.data.date === undefined || Number.isNaN(new Date(p.data.date).getTime()))
    .map((p) => `${p.rel}: date is ${JSON.stringify(p.data.date)}`);
  assert.deepEqual(bad, []);
});

// Eleventy parses `date:` with Luxon, which requires ISO 8601. US-style
// MM/DD/YYYY values fail the build, so catch them at the source.
test('every date front matter value is ISO 8601', () => {
  const bad = ALL
    .filter((p) => p.data.date !== undefined)
    .filter((p) => !/^\d{4}-\d{2}-\d{2}/.test(String(p.data.date instanceof Date
      ? p.data.date.toISOString()
      : p.data.date)))
    .map((p) => `${p.rel}: ${JSON.stringify(p.data.date)} is not ISO 8601`);
  assert.deepEqual(bad, []);
});

test('no placeholder description text remains', () => {
  const PLACEHOLDERS = [
    /this description will go in the meta description tag/i,
    /^TODO$/i,
    /^lorem ipsum/i,
  ];
  const bad = ALL
    .filter((p) => typeof p.data.description === 'string'
      && PLACEHOLDERS.some((re) => re.test(p.data.description.trim())))
    .map((p) => p.rel);
  assert.deepEqual(bad, []);
});

// A description reused verbatim across pages is either copy-paste rot or a
// description too generic to be worth having.
test('descriptions are not copy-pasted across pages', () => {
  const seen = new Map();
  for (const p of ALL) {
    const d = p.data.description?.trim();
    if (!d) continue;
    seen.set(d, [...(seen.get(d) ?? []), p.rel]);
  }
  const dupes = [...seen]
    .filter(([, files]) => files.length > 1)
    .map(([d, files]) => `"${d}" used by ${files.join(', ')}`);
  assert.deepEqual(dupes, []);
});
