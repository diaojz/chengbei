import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import postsIndex from '../../content/posts/index.json';
import seriesIndex from '../../content/series.json';

export type Lang = 'zh' | 'en';
export type Post = (typeof postsIndex)[number];

export const posts = postsIndex
  .filter((post) => !post.hidden)
  .sort((a, b) => (b.ts || 0) - (a.ts || 0));
export const series = seriesIndex;

export function postTitle(post: Post, lang: Lang) {
  return (lang === 'en' ? post.title_en : post.title_zh) || post.title_zh;
}

export function postExcerpt(post: Post, lang: Lang) {
  return (lang === 'en' ? post.excerpt_en : post.excerpt_zh) || post.excerpt_zh || '';
}

export function formatDate(ts: number, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(ts));
}

export function postTags(post: Post, lang: Lang) {
  const text = `${post.slug} ${post.title_zh}`.toLowerCase();
  const rules: Array<[RegExp, string, string]> = [
    [/dify|rag|chatflow/, 'Dify', 'Dify'],
    [/codex/, 'Codex', 'Codex'],
    [/claude/, 'Claude Code', 'Claude Code'],
    [/agent|mcp/, 'AI Agent', 'AI Agent'],
    [/直播|livestream/, '直播', 'Livestream'],
    [/求职|就业|career/, 'AI 求职', 'AI Career'],
    [/权限|登录|状态码|permissions|login|http/, '实用指南', 'Guide'],
    [/产品|用户|sdlc|交付/, '产品与工程', 'Product & Engineering']
  ];
  const found = rules.filter(([pattern]) => pattern.test(text)).map(([, zh, en]) => lang === 'zh' ? zh : en);
  if (!found.length) found.push(post.category === 'help' ? (lang === 'zh' ? '实用指南' : 'Guide') : (lang === 'zh' ? '思考' : 'Essay'));
  if (post.series && !found.includes('Dify')) found.push(post.series);
  return [...new Set(found)].slice(0, 3);
}

async function exists(file: string) {
  try { await access(file); return true; } catch { return false; }
}

export async function readPost(post: Post, lang: Lang) {
  const preferred = path.join(process.cwd(), 'content', 'posts', `${post.slug}.${lang}.md`);
  const fallback = path.join(process.cwd(), 'content', 'posts', `${post.slug}.zh.md`);
  const file = await exists(preferred) ? preferred : fallback;
  const markdown = await readFile(file, 'utf8');
  marked.setOptions({ gfm: true, breaks: false });
  const html = await marked.parse(markdown);
  return {
    markdown,
    html: html
      .replaceAll('href="/#/p/', 'href="/articles/')
      .replaceAll('href="#/p/', 'href="/articles/')
      .replace(/href="(\/articles\/[^"#]+)"/g, 'href="$1/"'),
    actualLang: file === preferred ? lang : 'zh'
  };
}
