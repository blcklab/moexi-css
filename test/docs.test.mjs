import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

test('README documents class usage and accessibility', () => {
  assert.match(readme, /mx mx-search/);
  assert.match(readme, /aria-hidden="true"/);
  assert.match(readme, /role="img" aria-label="Warning"/);
  assert.match(readme, /mx-size-20/);
  assert.match(readme, /Tailwind/);
});

test('README states the monochrome multicolor boundary', () => {
  assert.match(readme, /CSS masks are intentionally monochrome/);
  assert.match(readme, /color variants, layers, or custom icon definitions/);
});

test('Principia docs stay concise and cover the core integration paths', async () => {
  const index = await readFile(new URL('../docs/index.md', import.meta.url), 'utf8');
  const imports = await readFile(new URL('../docs/IMPORTS.md', import.meta.url), 'utf8');
  const playground = await readFile(new URL('../docs/PLAYGROUND.md', import.meta.url), 'utf8');
  assert.match(index, /npm install @blcklab\/moexi-css/);
  assert.match(index, /html playground/);
  assert.match(imports, /categories\/development\.css/);
  assert.match(imports, /icons\/search\.css/);
  assert.match(playground, /No package JavaScript runs/);
});
