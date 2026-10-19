import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile('src/data/projects.ts', 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
const context = { exports: {} };
new Script(outputText).runInNewContext(context);
const projects = context.exports.projects;

test('每个已上线项目都有独立封面，引用文件存在且确为 WebP', async () => {
  assert.equal(projects.length, 16);
  assert.equal(new Set(projects.map((project) => project.cover)).size, 16);
  for (const project of projects) {
    assert.ok(project.cover.startsWith('/assets/img/'), project.titleZh);
    const bytes = await readFile(project.cover.slice(1));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', project.titleZh);
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', project.titleZh);
  }
});

test('完整项目封面集合不超过 900 KiB，避免图片拖重列表', async () => {
  const images = await Promise.all(projects.map((project) => readFile(project.cover.slice(1))));
  const total = images.reduce((bytes, image) => bytes + image.byteLength, 0);
  assert.ok(total < 900 * 1024, `完整封面大小 ${total} bytes`);
});
