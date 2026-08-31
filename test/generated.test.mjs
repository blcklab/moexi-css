import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));

const categories = {
  ui: 20,
  navigation: 20,
  development: 20,
  files: 20,
  symbols: 20,
  communication: 26,
  media: 26,
  devices: 26,
  weather: 26,
  commerce: 26,
  lifestyle: 26,
};

test('catalog exposes exactly 256 canonical icons and 11 families', () => {
  assert.equal(catalog.iconCount, 256);
  assert.deepEqual(catalog.categories, categories);
  assert.equal(catalog.classPrefix, 'mx');
  assert.deepEqual(catalog.weights, ['thin', 'regular', 'bold']);
});

test('all generated icon and SVG assets exist', async () => {
  const icons = await readdir(new URL('../dist/icons/', import.meta.url));
  assert.equal(icons.length, 256);
  for (const icon of catalog.icons) {
    await access(new URL(`../dist/icons/${icon.name}.css`, import.meta.url));
    for (const weight of catalog.weights) {
      await access(new URL(`../dist/svg/${weight}/${icon.name}.svg`, import.meta.url));
    }
  }
});

test('official aliases resolve to canonical class rules', async () => {
  assert.deepEqual(catalog.aliases, {
    console: 'terminal',
    shell: 'terminal',
    favorite: 'heart',
    shine: 'sparkle',
  });
  const css = await readFile(new URL('../dist/moexi.css', import.meta.url), 'utf8');
  for (const alias of Object.keys(catalog.aliases)) {
    assert.match(css, new RegExp(`\\.mx-${alias}(?:,| \\{)`));
  }
});
