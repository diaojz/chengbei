import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { buildManifest } from '../scripts/content-manifest.mjs';

test('现有 Markdown 正文与重构前哈希基线一致', async () => {
  const expected = JSON.parse(await readFile('content-integrity.json', 'utf8'));
  const actual = await buildManifest();
  assert.deepEqual(actual, expected);
});
