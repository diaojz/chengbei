// ──────────────────────────────────────────────
// 文章详情页 — Hash 路由 + Markdown 渲染 + 双语
// 路由: #/p/<slug>
// 文件: content/posts/<slug>.{zh,en}.md
// 索引: content/posts/index.json
// ──────────────────────────────────────────────
// marked 按需加载：不开文章不下载（esm.sh 在弱网环境下拖慢首屏）
let markedPromise = null;
function getMarked() {
  if (!markedPromise) {
    markedPromise = import('https://esm.sh/marked@12').then(m => {
      m.marked.setOptions({ gfm: true, breaks: false });
      return m.marked;
    });
  }
  return markedPromise;
}

let postsIndex = [];
let seriesIndex = [];
let currentSlug = null;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadPostsIndex() {
  // app.js 已在首屏把 index.json 和 data.json 一起拉好（window.__postsIndex），
  // 这里直接复用，避免二次请求和中栏二次渲染
  if (Array.isArray(window.__postsIndex)) {
    postsIndex = window.__postsIndex;
  } else {
    try {
      const res = await fetch('content/posts/index.json');
      if (!res.ok) throw new Error(res.statusText);
      postsIndex = await res.json();
      postsIndex.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    } catch (e) {
      console.warn('[posts] index 加载失败', e);
      postsIndex = [];
    }
  }
  try {
    const res = await fetch('content/series.json');
    if (res.ok) seriesIndex = await res.json();
  } catch (e) {
    console.warn('[posts] series 加载失败', e);
  }

  renderWritingList();
  renderSeriesList();
  handleRoute();
}

// 系列首页入口：col-1 新增一个 SERIES 区块，一系列一行，标题 + 篇数
function renderSeriesList() {
  const section = document.getElementById('series-section');
  const container = document.getElementById('series-links');
  if (!section || !container) return;
  const lang = window.CURRENT_LANG || 'zh';
  const dict = (window.I18N && window.I18N[lang]) || {};

  const list = (seriesIndex || []).filter(s => Array.isArray(s.slugs) && s.slugs.length);
  section.hidden = list.length === 0;
  if (!list.length) return;

  container.innerHTML = list.map(s => {
    const title = s['title_' + lang] || s.title_zh || s.id;
    const n = s.slugs.length;
    return `<a href="#/series/${esc(s.id)}">${esc(title)} <span class="archive-meta">· ${n} ${esc(dict.series_progress || '')}</span></a>`;
  }).join('');
}

// 系列详情页：复用归档页同款 .archive-row 列表样式，按 slugs 声明顺序（= 阅读顺序 EP1→EPn）
function showSeries(id) {
  const s = (seriesIndex || []).find(x => x.id === id);
  if (!s) { location.hash = ''; return; }
  currentSlug = null;
  archiveOpen = false;
  const lang = window.CURRENT_LANG || 'zh';
  const view = document.getElementById('post-view');
  document.body.classList.add('reading');
  view.hidden = false;

  const lc = lang === 'zh' ? 'zh-CN' : 'en-GB';
  const fmt = ts => new Date(ts).toLocaleDateString(lc, { year: 'numeric', month: 'short', day: 'numeric' });
  const pad = i => String(i + 1).padStart(2, '0');

  const rows = s.slugs.map((slug, i) => {
    const p = postsIndex.find(x => x.slug === slug);
    if (!p) return '';
    return `<a class="archive-row" href="#/p/${esc(slug)}">` +
      `<span class="archive-idx">EP${pad(i)}</span>` +
      `<span class="archive-name">${esc(p['title_' + lang] || p.title_zh || '')}</span>` +
      `<span class="archive-meta">${p.ts ? fmt(p.ts) : ''}</span></a>`;
  }).join('');

  view.querySelector('.post-title').textContent = s['title_' + lang] || s.title_zh || '';
  view.querySelector('.post-meta').textContent = s['desc_' + lang] || s.desc_zh || '';
  view.querySelector('.post-body').innerHTML =
    `<div class="archive-sec">${rows}</div>`;

  const wm = view.querySelector('.post-watermark');
  if (wm) wm.textContent = '';

  view.scrollTop = 0;
  document.body.classList.add('post-ready');
}

// 合并 posts + data.json 的 writing[] 渲染到左侧 WRITING 区
function renderWritingList() {
  const container = document.getElementById('writing-links');
  if (!container) return;
  const lang = window.CURRENT_LANG || 'zh';
  const writingData = (window.__siteData && window.__siteData.writing) || [];

  const all = [
    ...postsIndex
      .filter(p => p.category !== 'help' && !p.hidden)
      .map(p => ({
        url: '#/p/' + p.slug,
        title_zh: p.title_zh,
        title_en: p.title_en,
        ts: p.ts,
      })),
    ...writingData,
  ]
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 8);

  // 一篇都没有时整个 Writing 板块（含标题）一起藏掉
  const section = container.closest('.section');
  if (section) section.style.display = all.length ? '' : 'none';

  container.innerHTML = all.map(item => {
    const title = item['title_' + lang] || item.title_zh || item.title || '';
    const href = item.url || '#';
    const isExternal = /^https?:\/\//.test(href);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${esc(href)}"${attrs}>${esc(title)}</a>`;
  }).join('');
}

// 文章属于某个系列时，正文顶部插一条「系列 · 第 N/M 篇 · 查看全系列」进度条
function seriesNavHtml(post, lang) {
  if (!post || !post.series) return '';
  const s = (seriesIndex || []).find(x => x.id === post.series);
  if (!s || !Array.isArray(s.slugs) || !s.slugs.length) return '';
  const dict = (window.I18N && window.I18N[lang]) || {};
  const total = s.slugs.length;
  const order = post.series_order || (s.slugs.indexOf(post.slug) + 1) || 1;
  const title = s['title_' + lang] || s.title_zh || '';
  return `<div class="series-nav">` +
    `<span class="series-tag">${esc(dict.series_title || 'Series')}</span>` +
    `<span>${esc(title)} · ${order}/${total} ${esc(dict.series_progress || '')}</span>` +
    `<a href="#/series/${esc(s.id)}">${esc(dict.series_all || 'view full series →')}</a>` +
    `</div>`;
}

async function showPost(slug) {
  currentSlug = slug;
  const post = postsIndex.find(p => p.slug === slug);
  if (!post) {
    location.hash = '';
    return;
  }
  const lang = window.CURRENT_LANG || 'zh';

  // 立即进入阅读模式 + 显示 loading（content opacity 0, .post-loading opacity 1）
  document.body.classList.remove('post-ready');
  document.body.classList.add('reading');
  const view = document.getElementById('post-view');
  view.hidden = false;

  const t0 = Date.now();
  const MIN_LOADING = 380;  // 保证 loading 至少展示 380ms, 节奏更舒服

  // 弱网容错：每个 URL 试两次（第二次绕 HTTP 缓存，避免缓存住的 404/失败响应）
  async function fetchMd(url) {
    for (let i = 0; i < 2; i++) {
      try {
        const res = await fetch(url, i ? { cache: 'reload' } : undefined);
        if (res.ok) return await res.text();
      } catch (_) {}
    }
    return null;
  }

  let md = await fetchMd(`content/posts/${slug}.${lang}.md`);
  if (md == null && lang !== 'zh') md = await fetchMd(`content/posts/${slug}.zh.md`);
  if (md == null) {
    md = lang === 'zh'
      ? '# 加载失败\n\n网络不太顺畅，正文没拉下来。请刷新页面重试。'
      : '# Failed to load\n\nThe network hiccuped and the article body didn\'t come through. Please refresh and try again.';
  }

  // 第一行 # 标题单独提取，避免和 .post-title 重复
  let title = post['title_' + lang] || post.title_zh || '';
  const lines = md.split('\n');
  if (lines[0] && lines[0].startsWith('# ')) {
    title = lines[0].slice(2).trim();
    md = lines.slice(1).join('\n').trim();
  }

  view.querySelector('.post-title').textContent = title;
  let bodyHtml;
  try {
    bodyHtml = (await getMarked()).parse(md);
  } catch (_) {
    // marked 没拉下来（CDN 不通）也不能白屏：按纯文本段落兜底渲染
    bodyHtml = md.split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('');
  }
  view.querySelector('.post-body').innerHTML = seriesNavHtml(post, lang) + bodyHtml;

  const dt = new Date(post.ts);
  const lc = lang === 'zh' ? 'zh-CN' : 'en-GB';
  view.querySelector('.post-meta').textContent =
    (lang === 'zh' ? '发布于 ' : 'Published ') +
    dt.toLocaleDateString(lc, { year: 'numeric', month: 'short', day: 'numeric' });
  // 角落水印：站点 + ISO 发布日期
  const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  const wm = view.querySelector('.post-watermark');
  if (wm) wm.textContent = `chengbei.org · ${iso}`;

  // 等够 MIN_LOADING, 让 loading 动画呼吸一下再切到内容
  const elapsed = Date.now() - t0;
  if (elapsed < MIN_LOADING) {
    await new Promise(r => setTimeout(r, MIN_LOADING - elapsed));
  }

  view.scrollTop = 0;
  // 路由切换时如果当前 slug 已经变了, 不要覆盖 (防快速点击竞态)
  if (currentSlug !== slug) return;
  document.body.classList.add('post-ready');
}

// ── 全屏目录页（#/all）— Ships 全量 + 全部文章，Awwwards 式列表行 ──
let archiveOpen = false;

function showArchive() {
  currentSlug = null;
  archiveOpen = true;
  const lang = window.CURRENT_LANG || 'zh';
  const dict = (window.I18N && window.I18N[lang]) || {};
  const view = document.getElementById('post-view');
  document.body.classList.add('reading');
  view.hidden = false;

  const ships = dict.artifacts || [];
  const posts = (postsIndex || []).filter(p => !p.hidden)
    .slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const lc = lang === 'zh' ? 'zh-CN' : 'en-GB';
  const fmt = ts => new Date(ts).toLocaleDateString(lc, { year: 'numeric', month: 'short', day: 'numeric' });
  const pad = i => String(i + 1).padStart(2, '0');

  const shipRows = ships.map((s, i) => {
    const ext = /^https?:\/\//.test(s.href);
    // 有 date 显示发布日期（站内文章页都有），否则外链 ↗ / 站内徽标兜底
    const meta = s.date ? esc(s.date) : (ext ? '↗' : (lang === 'zh' ? '站内' : 'on-site'));
    return `<a class="archive-row" href="${esc(s.href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>` +
      `<span class="archive-idx">${pad(i)}</span>` +
      `<span class="archive-name">${esc(s.label)}</span>` +
      `<span class="archive-meta">${meta}</span></a>`;
  }).join('');

  const postRows = posts.map((p, i) =>
    `<a class="archive-row" href="#/p/${esc(p.slug)}">` +
      `<span class="archive-idx">${pad(i)}</span>` +
      `<span class="archive-name">${esc(p['title_' + lang] || p.title_zh || '')}</span>` +
      `<span class="archive-meta">${p.ts ? fmt(p.ts) : ''}</span></a>`
  ).join('');

  view.querySelector('.post-title').textContent =
    dict.archive_title || (lang === 'zh' ? '目录 · 全部作品' : 'Index · All Work');
  view.querySelector('.post-meta').textContent = lang === 'zh'
    ? `${ships.length} 项作品 · ${posts.length} 篇文章`
    : `${ships.length} ships · ${posts.length} posts`;
  view.querySelector('.post-body').innerHTML =
    `<div class="archive-sec"><div class="archive-sec-title">${esc(dict.archive_ships || 'Ships')}<b>${ships.length}</b></div>${shipRows}</div>` +
    `<div class="archive-sec"><div class="archive-sec-title">${esc(dict.archive_posts || 'Writing')}<b>${posts.length}</b></div>${postRows}</div>`;

  const wm = view.querySelector('.post-watermark');
  if (wm) wm.textContent = '';  // 目录页不带具体日期，水印留空

  view.scrollTop = 0;
  document.body.classList.add('post-ready');
}

function hidePost() {
  document.body.classList.remove('reading');
  document.body.classList.remove('post-ready');
  const view = document.getElementById('post-view');
  if (view) {
    // 等淡出过渡跑完再 hidden, 避免突然消失
    setTimeout(() => {
      if (!document.body.classList.contains('reading')) view.hidden = true;
    }, 360);
  }
  currentSlug = null;
  archiveOpen = false;
}

function handleRoute() {
  const m = /^#\/p\/([\w-]+)$/.exec(location.hash);
  const sm = /^#\/series\/([\w-]+)$/.exec(location.hash);
  if (m) { archiveOpen = false; showPost(m[1]); }
  else if (sm) showSeries(sm[1]);
  else if (location.hash === '#/all') showArchive();
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
    renderSeriesList();
    const sm = /^#\/series\/([\w-]+)$/.exec(location.hash);
    if (currentSlug) showPost(currentSlug);
    else if (sm) showSeries(sm[1]);
    else if (archiveOpen) showArchive();
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
