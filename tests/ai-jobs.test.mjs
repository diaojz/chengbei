import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'content', 'ai-jobs', 'index.json');

test('岗位集锦提供首批十个可展示的岗位', () => {
  assert.ok(fs.existsSync(dataFile), '岗位集锦必须提供 content/ai-jobs/index.json');
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  assert.equal(data.version, 1, '数据版本应为 1');
  assert.ok(Array.isArray(data.jobs) && data.jobs.length >= 10, '首批至少接入十个岗位');

  for (const job of data.jobs) {
    for (const key of ['slug', 'category', 'title_zh', 'title_en', 'summary_zh', 'updated_at', 'card']) {
      assert.ok(job[key], `${job.slug || 'unknown'} 缺少 ${key}`);
    }
    assert.notEqual(job.sample_count, undefined, `${job.slug} 缺少 sample_count`);
    assert.ok(Array.isArray(job.sections) && job.sections.length >= 3, `${job.slug} 必须提供可阅读的 JD 研究内容`);
    assert.match(job.slug, /^[a-z0-9-]+$/);
    assert.ok(Number.isInteger(job.sample_count) && job.sample_count >= 0);
    assert.ok(['published', 'researching'].includes(job.status), `${job.slug} 必须标记研究状态`);
    assert.ok(fs.existsSync(path.join(root, job.card)) || fs.existsSync(path.join(root, 'public', job.card)), `${job.slug} 的知识卡不存在`);
  }
});

test('岗位集锦提供聚合页与静态详情路由', async () => {
  const indexPage = fs.readFileSync(path.join(root, 'src/pages/ai-jobs/index.astro'), 'utf8');
  const detailPage = fs.readFileSync(path.join(root, 'src/pages/ai-jobs/[slug].astro'), 'utf8');
  assert.match(indexPage, /岗位集锦/);
  assert.match(indexPage, /job-library-layout/, '聚合页应使用岗位库主栏布局');
  assert.match(indexPage, /job-library-list/, '聚合页首屏应展示岗位列表');
  assert.match(detailPage, /getStaticPaths/);
  assert.match(detailPage, /job-platform-layout/, '详情页应使用招聘平台式主栏与侧栏布局');
  assert.match(detailPage, /job-sections/, '详情页应渲染 JD 要求与面试要点');
  assert.match(detailPage, /job-reader-nav/, '详情页应提供可扫读的章节导航');
});
