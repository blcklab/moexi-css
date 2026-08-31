import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const full = await readFile(new URL('../dist/moexi.css', import.meta.url), 'utf8');
const regular = await readFile(new URL('../dist/regular.css', import.meta.url), 'utf8');
const base = await readFile(new URL('../dist/base.css', import.meta.url), 'utf8');

test('base class renders a currentColor SVG mask', () => {
  assert.match(base, /\.mx \{/);
  assert.match(base, /background-color: currentColor/);
  assert.match(base, /-webkit-mask-image: var\(--mx-icon\)/);
  assert.match(base, /mask-image: var\(--mx-icon\)/);
  assert.match(base, /inline-size: 1em/);
  assert.match(base, /block-size: 1em/);
});

test('complete stylesheet supports three weights and canonical search class', () => {
  assert.match(full, /\.mx-thin/);
  assert.match(full, /\.mx-regular/);
  assert.match(full, /\.mx-bold/);
  assert.match(full, /\.mx-search \{/);
  assert.match(full, /svg\/thin\/search\.svg/);
  assert.match(full, /svg\/regular\/search\.svg/);
  assert.match(full, /svg\/bold\/search\.svg/);
});

test('regular-only surface omits thin and bold icon asset URLs', () => {
  assert.match(regular, /svg\/regular\/search\.svg/);
  assert.doesNotMatch(regular, /svg\/thin\/search\.svg/);
  assert.doesNotMatch(regular, /svg\/bold\/search\.svg/);
});

test('package is mask-based rather than font or embedded-data based', () => {
  assert.doesNotMatch(full, /@font-face/i);
  assert.doesNotMatch(full, /font-family:/i);
  assert.doesNotMatch(full, /data:image/i);
});

test('size helpers avoid Tailwind numeric mx-* collisions', () => {
  assert.match(base, /\.mx-size-20/);
  assert.match(base, /\.mx-size-24/);
  assert.doesNotMatch(base, /\.mx-20\s*\{/);
  assert.doesNotMatch(base, /\.mx-24\s*\{/);
});
