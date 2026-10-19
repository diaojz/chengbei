import assert from 'node:assert/strict';
import test from 'node:test';
import { marked } from 'marked';
import { readArticleFilters, articleMatches, articleFilterURL } from '../src/lib/article-discovery.mjs';
import { createHeadingCollector, seriesNeighbours, readingProgress } from '../src/lib/reading.mjs';

test('共享筛选链接支持编码主题、英文大小写与中文查询', () => {
  const url = articleFilterURL('/articles/?source=home#content', { topic: '产品与工程', query: '  npm 入门  ' });
  assert.deepEqual(readArticleFilters(url, ['产品与工程']), { topic: '产品与工程', query: 'npm 入门' });
  assert.ok(url.includes('source=home'));
  assert.ok(url.endsWith('#content'));
  assert.equal(articleMatches({ text: 'NPM 和 npx 入门', topics: ['产品与工程'] }, { topic: '产品与工程', query: 'npm 入门' }), true);
  assert.equal(articleMatches({ text: 'NPM 和 npx 入门', topics: ['产品与工程'] }, { topic: 'Codex', query: 'npm' }), false);
  assert.equal(articleMatches({ text: 'npm 安装', topics: [] }, { topic: '', query: 'npm 入门' }), false);
});

test('筛选可恢复历史状态，未知主题回退全部，清除时保留无关参数', () => {
  assert.deepEqual(readArticleFilters('/en/articles/?topic=unknown&q=Codex', ['Guide']), { topic: '', query: 'Codex' });
  assert.deepEqual(readArticleFilters('/articles/?topic=Codex', ['Codex']), { topic: 'Codex', query: '' });
  assert.equal(articleFilterURL('/articles/?topic=Codex&q=npm&source=home', { topic: '', query: '' }), '/articles/?source=home');
  assert.equal(articleMatches({ text: 'ＮＰＭ 入门', topics: [] }, { topic: '', query: 'npm' }), true);
  assert.equal(articleMatches({ text: '', topics: [] }, { topic: '', query: '   ' }), true);
});

test('目录锚点处理重复标题、中文与标点，且多个文章渲染互不污染', () => {
  const first = createHeadingCollector();
  const second = createHeadingCollector();
  const renderer = new marked.Renderer();
  renderer.heading = function ({ depth, tokens }) {
    const label = this.parser.parseInline(tokens);
    return `<h${depth} id="${first.add(depth, label)}">${label}</h${depth}>`;
  };
  const html = marked.parse('# 标题\n\n## 安装？\n\n### npm `run`\n\n## 安装？', { renderer });
  assert.deepEqual(first.headings.map((heading) => heading.id), ['section-2', 'section-3', 'section-4']);
  for (const heading of first.headings) assert.ok(html.includes(`id="${heading.id}"`));
  assert.equal(new Set(first.headings.map((heading) => heading.id)).size, 3);
  assert.equal(second.add(2, '另一篇'), 'section-1');
});

test('系列前后篇正确处理首篇、末篇、单篇与不在系列中的文章', () => {
  assert.deepEqual(seriesNeighbours(['one', 'two', 'three'], 'one'), { previous: null, next: 'two' });
  assert.deepEqual(seriesNeighbours(['one', 'two', 'three'], 'two'), { previous: 'one', next: 'three' });
  assert.deepEqual(seriesNeighbours(['one', 'two', 'three'], 'three'), { previous: 'two', next: null });
  assert.deepEqual(seriesNeighbours(['one'], 'one'), { previous: null, next: null });
  assert.deepEqual(seriesNeighbours(['one'], 'absent'), { previous: null, next: null });
});

test('阅读进度限定正文范围，正确处理短文、正文前与正文后', () => {
  assert.equal(readingProgress(200, 1200, 0), 0);
  assert.equal(readingProgress(200, 1200, 700), 0.5);
  assert.equal(readingProgress(200, 1200, 2000), 1);
  assert.equal(readingProgress(200, 100, 0), 0);
  assert.equal(readingProgress(200, 100, 200), 1);
});
