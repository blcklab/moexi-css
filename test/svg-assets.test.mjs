import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

for (const icon of ['search', 'heart', 'terminal', 'flame', 'moon', 'image']) {
  test(`${icon} masks are standalone monochrome SVG across all weights`, async () => {
    for (const weight of ['thin', 'regular', 'bold']) {
      const svg = await readFile(new URL(`../dist/svg/${weight}/${icon}.svg`, import.meta.url), 'utf8');
      assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 24 24"/);
      assert.match(svg, /#000/);
      assert.doesNotMatch(svg, /currentColor/);
      assert.doesNotMatch(svg, /<script|onload=|onclick=/i);
      assert.doesNotMatch(svg, / width="24"| height="24"/);
    }
  });
}
