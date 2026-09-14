import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('产品版提供可持久化的经典布局入口', async () => {
  const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
  assert.match(layout, /data-layout-switch/);
  assert.match(layout, /chengbei-layout/);
  assert.match(layout, /\/classic\//);
});

test('经典版提供返回产品布局的入口并复用根目录资源', async () => {
  const classic = await readFile('classic/index.html', 'utf8');
  assert.match(classic, /<base href="\/">/);
  assert.match(classic, /data-layout-switch/);
  assert.match(classic, /chengbei-layout/);
  assert.match(classic, /新版布局/);
});

test('构建脚本保留经典版原地址', async () => {
  const copyScript = await readFile('scripts/copy-legacy.mjs', 'utf8');
  assert.match(copyScript, /'classic'/);
  assert.match(copyScript, /'styles\.css'/);
  assert.match(copyScript, /'js'/);
  assert.match(copyScript, /'content'/);
});
