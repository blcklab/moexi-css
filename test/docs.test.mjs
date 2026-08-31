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
