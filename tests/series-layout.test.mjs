import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('系列页使用独立的通栏列表布局', async () => {
  const page = await readFile('src/pages/series/[id].astro', 'utf8');
  const styles = await readFile('src/styles/product.css', 'utf8');

  assert.match(page, /class="shell series-index"/);
  assert.match(styles, /\.series-index\s*\{[^}]*display:\s*block/s);
  assert.match(styles, /\.series-index \.post-row\s*\{[^}]*grid-template-columns:/s);
});

test('系列页在手机窄屏恢复单列阅读', async () => {
  const styles = await readFile('src/styles/product.css', 'utf8');
  assert.match(styles, /@media \(max-width:\s*560px\)[\s\S]*\.series-index \.post-row\s*\{[^}]*display:\s*block/s);
});
