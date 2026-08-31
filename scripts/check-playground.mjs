import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const config = JSON.parse(await readFile(new URL('principia.config.json', root), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('.principia/playground.json', root), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('dist/catalog.json', root), 'utf8'));
const playgroundCss = await readFile(new URL('dist/playground.css', root), 'utf8');

assert.equal(config.$schema, 'https://raw.githubusercontent.com/blcklab/principia/main/public/schemas/v0.22/principia.schema.json');
assert.deepEqual(config.playground, { enabled: true, manifest: '.principia/playground.json' });
assert.deepEqual(config.content, { root: 'docs' });
assert.equal(config.entry, 'index.md');

assert.equal(manifest.$schema, 'https://raw.githubusercontent.com/blcklab/principia/main/public/schemas/v0.22/playground.schema.json');
assert.equal(manifest.defaultPlugin, 'moexi-css');
assert.equal(manifest.plugins.length, 1);
const plugin = manifest.plugins[0];
assert.equal(plugin.id, 'moexi-css');
assert.equal(plugin.adapter, 'css');
assert.deepEqual(plugin.asset, {
  provider: 'jsdelivr-npm',
  package: pkg.name,
  version: pkg.version,
  path: 'dist/playground.css',
});
assert.equal(plugin.examplesRoot, '.principia/playground/moexi-css/examples');
assert.equal(plugin.defaultExample, 'quick-start');
assert.deepEqual(plugin.examples.map(({ id }) => id), [
  'quick-start', 'weights', 'sizes', 'colors', 'buttons',
  'navigation', 'status-cards', 'aliases', 'icon-grid', 'accessibility',
]);

const canonical = new Set(catalog.icons.map(({ name }) => name));
const aliases = new Set(Object.keys(catalog.aliases));
const ignored = new Set([
  'mx', 'mx-thin', 'mx-regular', 'mx-bold', 'mx-size',
  ...catalog.sizes.map((size) => `mx-size-${size}`),
]);

for (const example of plugin.examples) {
  const directory = new URL(`${plugin.examplesRoot}/${example.id}/`, root);
  const html = await readFile(new URL('index.html', directory), 'utf8');
  await access(new URL('style.css', directory));
  assert.doesNotMatch(html, /<script\b|javascript:/i, `${example.id} must stay CSS-only`);
  assert.match(html, /class=/, `${example.id} should demonstrate class-based usage`);

  for (const match of html.matchAll(/\bmx-[a-z0-9-]+\b/g)) {
    const className = match[0];
    if (ignored.has(className)) continue;
    const name = className.slice(3);
    assert.ok(
      canonical.has(name) || aliases.has(name),
      `${example.id} references unknown icon class ${className}`,
    );
  }
}

const cdnRoot = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/svg/`;
assert.match(playgroundCss, /\.mx-search/);
assert.ok(
  playgroundCss.includes(cdnRoot),
  'playground.css must pin SVG assets to the exact package CDN version',
);
assert.doesNotMatch(
  playgroundCss,
  /url\(["']?\.\.?\//,
  'playground.css must not contain relative mask URLs',
);
assert.doesNotMatch(playgroundCss, /@font-face|data:image/i);

for (const doc of ['index.md', 'USAGE.md', 'IMPORTS.md', 'ACCESSIBILITY.md', 'PLAYGROUND.md']) {
  await access(new URL(`docs/${doc}`, root));
}

console.log(
  `Moexi CSS Principia Playground verified: ${plugin.examples.length} examples, ${catalog.iconCount} icons.`,
);
