import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const size = async (url) => (await stat(url)).size;
const full = new URL('../dist/moexi.css', import.meta.url);
const regular = new URL('../dist/regular.css', import.meta.url);
const fullText = await readFile(full);
const iconFiles = await readdir(new URL('../dist/icons/', import.meta.url));
const svgFiles = [];
for (const weight of ['thin', 'regular', 'bold']) {
  for (const name of await readdir(new URL(`../dist/svg/${weight}/`, import.meta.url))) {
    svgFiles.push(new URL(`../dist/svg/${weight}/${name}`, import.meta.url));
  }
}
const maxIconCss = Math.max(...await Promise.all(iconFiles.map((name) => size(new URL(`../dist/icons/${name}`, import.meta.url)))));
const maxSvg = Math.max(...await Promise.all(svgFiles.map(size)));
const svgTotal = (await Promise.all(svgFiles.map(size))).reduce((a, b) => a + b, 0);
const measured = {
  fullCssBytes: await size(full),
  fullCssGzipBytes: gzipSync(fullText).length,
  regularCssBytes: await size(regular),
  maxIconCssBytes: maxIconCss,
  maxSvgBytes: maxSvg,
  svgAssetBytes: svgTotal,
};
const budgets = {
  fullCssBytes: 65536,
  fullCssGzipBytes: 8192,
  regularCssBytes: 32768,
  maxIconCssBytes: 2048,
  maxSvgBytes: 2048,
  svgAssetBytes: 350000,
};
for (const [key, limit] of Object.entries(budgets)) {
  assert.ok(measured[key] <= limit, `${key} ${measured[key]} exceeds ${limit}`);
}
console.log(JSON.stringify({ version: '1.0.0', budgets, measured }, null, 2));
