// ──────────────────────────────────────────────
// 文章详情页 — Hash 路由 + Markdown 渲染 + 双语
// 路由: #/p/<slug>
// 文件: content/posts/<slug>.{zh,en}.md
// 索引: content/posts/index.json
// ──────────────────────────────────────────────
import { marked } from 'https://esm.sh/marked@12';

marked.setOptions({ gfm: true, breaks: false });

let postsIndex = [];
let currentSlug = null;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadPostsIndex() {
  try {
    const res = await fetch('content/posts/index.json');
    if (!res.ok) throw new Error(res.statusText);
    postsIndex = await res.json();
    postsIndex.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch (e) {
    console.warn('[posts] index 加载失败', e);
    postsIndex = [];
  }
  renderWritingList();
  handleRoute();
}

// 合并 posts + data.json 的 writing[] 渲染到左侧 WRITING 区
function renderWritingList() {
  const container = document.getElementById('writing-links');
  if (!container) return;
  const lang = window.CURRENT_LANG || 'zh';
  const writingData = (window.__siteData && window.__siteData.writing) || [];

  const all = [
    ...postsIndex.map(p => ({
      url: '#/p/' + p.slug,
      title_zh: p.title_zh,
      title_en: p.title_en,
      ts: p.ts,
    })),
    ...writingData,
  ]
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 5);

  container.innerHTML = all.map(item => {
    const title = item['title_' + lang] || item.title_zh || item.title || '';
    const href = item.url || '#';
    const isExternal = /^https?:\/\//.test(href);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${esc(href)}"${attrs}>${esc(title)}</a>`;
  }).join('');
}

async function showPost(slug) {
  currentSlug = slug;
  const post = postsIndex.find(p => p.slug === slug);
  if (!post) {
    location.hash = '';
    return;
  }
  const lang = window.CURRENT_LANG || 'zh';

  let md = '';
  try {
    const res = await fetch(`content/posts/${slug}.${lang}.md`);
    if (!res.ok) throw new Error(res.statusText);
    md = await res.text();
  } catch (e) {
    try {
      const fallback = await fetch(`content/posts/${slug}.zh.md`);
      md = await fallback.text();
    } catch (e2) {
      md = '# 加载失败\n\n找不到这篇文章。';
    }
  }

  // 第一行 # 标题单独提取，避免和 .post-title 重复
  let title = post['title_' + lang] || post.title_zh || '';
  const lines = md.split('\n');
  if (lines[0] && lines[0].startsWith('# ')) {
    title = lines[0].slice(2).trim();
    md = lines.slice(1).join('\n').trim();
  }

  const view = document.getElementById('post-view');
  view.querySelector('.post-title').textContent = title;
  view.querySelector('.post-body').innerHTML = marked.parse(md);

  const dt = new Date(post.ts);
  const lc = lang === 'zh' ? 'zh-CN' : 'en-GB';
  view.querySelector('.post-meta').textContent = dt.toLocaleDateString(lc, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  view.scrollTop = 0;
  document.body.classList.add('reading');
  view.hidden = false;
}

function hidePost() {
  document.body.classList.remove('reading');
  const view = document.getElementById('post-view');
  if (view) view.hidden = true;
  currentSlug = null;
}

function handleRoute() {
  const m = /^#\/p\/([\w-]+)$/.exec(location.hash);
  if (m) showPost(m[1]);
  else hidePost();
}

window.addEventListener('hashchange', handleRoute);

// 关闭按钮 → 清 hash → handleRoute 触发 hidePost
document.addEventListener('click', e => {
  if (e.target.closest('.post-close')) {
    location.hash = '';
  }
});

// ESC 键退出阅读模式
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.body.classList.contains('reading')) {
    location.hash = '';
  }
});

// 语言切换时：列表重渲染 + 文章页（如有）重载
document.addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  // 等 i18n.js 完成切换（它会改 window.CURRENT_LANG），再重渲染
  setTimeout(() => {
    renderWritingList();
    if (currentSlug) showPost(currentSlug);
  }, 60);
});

// 等 app.js 把 data.json 拉下来 + writing 渲染好, 再合并 posts
function waitForSiteData(cb, attempts = 0) {
  if (window.__siteData) return cb();
  if (attempts > 50) return cb();  // 超时也跑, 起码 posts 能进
  setTimeout(() => waitForSiteData(cb, attempts + 1), 50);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => waitForSiteData(loadPostsIndex));
} else {
  waitForSiteData(loadPostsIndex);
}
