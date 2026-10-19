import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { createHeadingCollector } from './reading.mjs';
import { localImageDimensions } from './image-dimensions.mjs';
import postsIndex from '../../content/posts/index.json';
import seriesIndex from '../../content/series.json';
import visuals from '../../content/visuals.json';

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

export function postCover(post: Post) {
  return (visuals.articles as Record<string, { src: string }>)[post.slug]?.src;
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
  const collector = createHeadingCollector();
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const label = this.parser.parseInline(tokens);
    const text = label.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity] || entity);
    const id = collector.add(depth, text);
    return `<h${depth} id="${id}">${label}</h${depth}>\n`;
  };
  let html = await marked.parse(markdown, { gfm: true, breaks: false, renderer });
  html = html.replace(/src="assets\//g, 'src="/assets/');
  for (const visual of Object.values(visuals.articles)) {
    if ('original' in visual && visual.original) {
      html = html.replaceAll(`src="${visual.original}"`, `src="${visual.src}"`)
        .replaceAll(`src="${visual.original.slice(1)}"`, `src="${visual.src}"`);
    }
  }
  const imageTags=[...html.matchAll(/<img\b([^>]*?)>/gi)];
  const rendered=await Promise.all(imageTags.map(async ([tag,attrs])=>{
    const src=/\bsrc=["']([^"']+)["']/.exec(attrs)?.[1];
    const size=await localImageDimensions(src);
    const extra=`${/\bloading=/.test(attrs)?'':' loading="lazy"'}${/\bdecoding=/.test(attrs)?'':' decoding="async"'}${size&&!/\bwidth=/.test(attrs)?` width="${size.width}"`:''}${size&&!/\bheight=/.test(attrs)?` height="${size.height}"`:''}`;
    return `<img${attrs}${extra}>`;
  }));
  let imageIndex=0;html=html.replace(/<img\b([^>]*?)>/gi,()=>rendered[imageIndex++]);

  return {
    markdown,
    headings: collector.headings,
    readingMinutes: Math.max(1, Math.ceil((markdown.match(/[\u3400-\u9fff]/g) || []).length / 350 + (markdown.match(/[A-Za-z0-9]+/g) || []).length / 220)),
    html: html
      .replaceAll('href="/#/p/', 'href="/articles/')
      .replaceAll('href="#/p/', 'href="/articles/')
      .replace(/href="(\/articles\/[^"#]+)"/g, 'href="$1/"'),
    actualLang: file === preferred ? lang : 'zh'
  };
}
