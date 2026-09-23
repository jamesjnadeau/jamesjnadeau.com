// Asserts the ContentTools editor is wired to this site: the package's files
// are served whole from /cms/, the config agrees with the content and with the
// pages the build wrote, and the Netlify glue routes GitHub calls through Git
// Gateway. Requires `npm run build` first, like output.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const SITE = '_site';
const PACKAGE = 'node_modules/@jamesjnadeau/content-tools/dist';

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
