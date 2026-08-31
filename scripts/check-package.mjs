import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const result = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' }))[0];
assert.ok(result.size <= 80000, `packed package ${result.size} exceeds 80 KB`);
assert.ok(result.unpackedSize <= 900000, `unpacked package ${result.unpackedSize} exceeds 900 KB`);
assert.ok(result.files.length <= 1100, `file count ${result.files.length} exceeds 1100`);
const forbidden = result.files.filter((file) => /^(docs|\.github|examples)\//.test(file.path));
assert.deepEqual(forbidden, [], `Repository-only files leaked into npm: ${forbidden.map((file) => file.path).join(', ')}`);
console.log(JSON.stringify({
  name: result.name,
  version: result.version,
  fileCount: result.files.length,
  packedBytes: result.size,
  unpackedBytes: result.unpackedSize,
}, null, 2));
