import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const legacyPaths = [
  'apple-dev-migration',
  'assets',
  'codex-reconnect',
  'classic',
  'content',
  'dingtalk-one',
  'ghostty-checklist',
  'ghostty-terminal',
  'judge-accuracy',
  'js',
  'lib',
  'livestream-compliance',
  'mac-livestream-setup',
  'mini-harness',
  'sop-teardown',
  'styles.css',
  'tech-notes',
  'tokens-2026-06'
];

await mkdir(out, { recursive: true });
for (const item of legacyPaths) {
  await cp(path.join(root, item), path.join(out, item), { recursive: true });
}
await cp(path.join(root, 'CNAME'), path.join(out, 'CNAME'));
await cp(path.join(root, 'robots.txt'), path.join(out, 'robots.txt'));
console.log(`已保留 ${legacyPaths.length} 组旧站资源与原 URL`);
