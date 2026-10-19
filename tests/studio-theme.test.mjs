import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { Script } from 'node:vm';
import test from 'node:test';

const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
const init = layout.match(/<body[^>]*>\s*<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(init, '主题初始化应在页面内容之前执行');

function runTheme(saved, blocked = false) {
  const document = { body: { dataset: {} }, documentElement: { style: {} } };
  new Script(init).runInNewContext({
    document,
    localStorage: { getItem() { if (blocked) throw new Error('storage denied'); return saved; } },
    matchMedia() { throw new Error('不应根据系统深色偏好改变首次默认主题'); }
  });
  return document;
}

test('首次访问固定浅色，不因系统暗色而变化；无效和不可用存储安全回退', () => {
  for (const [saved, blocked] of [[null, false], ['invalid', false], [null, true]]) {
    const document = runTheme(saved, blocked);
    assert.equal(document.body.dataset.theme, 'light');
    assert.equal(document.documentElement.style.colorScheme, 'light');
  }
});

test('用户明确保存的主题选择仍被尊重', () => {
  assert.equal(runTheme('dark').body.dataset.theme, 'dark');
  assert.equal(runTheme('light').body.dataset.theme, 'light');
});

test('存储被禁用时仍可手动来回切换主题', () => {
  const scripts = [...layout.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)];
  const script = scripts.at(-1)[1];
  let toggle;
  const document = {
    body: { dataset: { theme: 'light' } }, documentElement: { style: {} },
    querySelector(selector) { return selector === '[data-theme-toggle]' ? { addEventListener(_type, listener) { toggle = listener; } } : null; }
  };
  new Script(script).runInNewContext({ document, location: { pathname: '/about/', hash: '' }, localStorage: { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); } } });
  toggle(); assert.equal(document.body.dataset.theme, 'dark');
  toggle(); assert.equal(document.body.dataset.theme, 'light');
});

test('配图为压缩静态 WebP，总大小保持在 240 KiB 以内', async () => {
  let bytes = 0;
  for (const name of ['workspace', 'build', 'learn', 'explore']) {
    const path = `assets/img/about-studio/${name}.webp`;
    const buffer = await readFile(path);
    assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
    bytes += (await stat(path)).size;
  }
  assert.ok(bytes < 240 * 1024, `实际图片体积 ${bytes} bytes`);
});

test('关于页没有循环动画，尊重减少动态效果偏好，使用独立图文区域', async () => {
  const css = await readFile('src/styles/studio.css', 'utf8');
  const page = await readFile('src/components/AboutPage.astro', 'utf8');
  assert.doesNotMatch(css, /\binfinite\b/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /animation:none/);
  assert.match(css, /@media \(min-width:1001px\)/);
  assert.match(css, /@media \(max-width:700px\)/);
  assert.match(page, /fetchpriority="high"/);
  assert.match(page, /loading="lazy"/);
  assert.doesNotMatch(page, /<main|<canvas|<video|setInterval|requestAnimationFrame/);
});
