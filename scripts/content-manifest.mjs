import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const postsDir = path.join(root, 'content', 'posts');
const output = path.join(root, 'content-integrity.json');

export async function buildManifest() {
  const files = (await readdir(postsDir))
    .filter((name) => name.endsWith('.md'))
    .sort();
  const entries = {};

  for (const name of files) {
    const source = await readFile(path.join(postsDir, name));
    entries[`content/posts/${name}`] = createHash('sha256').update(source).digest('hex');
  }

  return entries;
}

if (process.argv.includes('--write')) {
  const manifest = await buildManifest();
  await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`已记录 ${Object.keys(manifest).length} 篇 Markdown 正文`);
}
