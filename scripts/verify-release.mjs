import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);

const catalog = JSON.parse(
  await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8')
);

const css = await readFile(
  new URL('../dist/moexi.css', import.meta.url),
  'utf8'
);

assert.equal(pkg.name, '@blcklab/moexi-css');
assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
assert.deepEqual(pkg.sideEffects, ['**/*.css']);
assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);

assert.equal(catalog.iconCount, 256);
assert.match(catalog.coreVersion, /^1\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
assert.equal(catalog.multicolor, false);
assert.equal(catalog.colorModel, 'currentColor-mask');

assert.match(css, /\.mx-search/);
assert.doesNotMatch(css, /@font-face|data:image/i);

assert.equal(
  pkg.repository?.url,
  'https://github.com/blcklab/moexi-css'
);

assert.equal(pkg.publishConfig?.access, 'public');
assert.equal(pkg.publishConfig?.provenance, true);

console.log(
  `Moexi CSS ${pkg.version} verified: ${catalog.iconCount} icons, core ${catalog.coreVersion}.`
);