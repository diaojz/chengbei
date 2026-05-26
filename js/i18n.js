// ──────────────────────────────────────────────
// 国际化：中英双语
// 所有面向用户的文案都在这里。语言切换无刷新、不持久化。
// ──────────────────────────────────────────────
window.I18N = {
  zh: {
    title: '城北 · 个人站',
    intro: '城北<span class="intro-sub">AI Coding 讲师 · 独立开发者<br>把 AI 开发带给零基础学员</span>',
    artifacts_title: 'Ships',
    writing_title: 'Writing',
    social_title: 'Social',
    artifacts: [
      { label: 'Typevoise · macOS 语音输入', href: 'https://github.com/diaojz' },
      { label: 'AI Gateway · Claude Code 中转', href: 'https://gw.diaoye.org' }
    ],
    howto:
      '<div class="entry-text">' +
      'howto · 玩法\n\n' +
      '键盘（桌面）：\n' +
      '  D — 白昼 · 暖白底\n' +
      '  N — 夜晚 · 回到默认黑\n' +
      '  S — 晚夏 · 飘叶 + 森林音\n' +
      '  M — 深夜 · 月色 + 虫鸣\n' +
      '  R — 雨天 · 冷灰底 + 雨声\n' +
      '  C — 混沌 · 一切坍塌，再按归位\n\n' +
      '* 没声音？点一下页面' +
      '</div>',
    howto_mobile:
      '<div class="entry-text">' +
      'howto · 玩法\n\n' +
      '点 logo 字母：\n' +
      '  C — 白昼 · 暖白底\n' +
      '  B — 晚夏 / 雨天（点一下切换）\n' +
      '  E — 夜晚 / 深夜（点一下切换）\n' +
      '  I — 混沌 · 一切坍塌，再点归位\n\n' +
      '* 没声音？先点一下屏幕' +
      '</div>',
    social: [
      { label: 'GitHub/diaojz', href: 'https://github.com/diaojz' },
      { label: 'mail/hi@chengbei.org', href: 'mailto:hi@chengbei.org' }
    ],
    error_loading: '内容加载失败'
  },
  en: {
    title: 'Chengbei · Personal Site',
    intro: 'Chengbei<span class="intro-sub">AI Coding Instructor · Indie Hacker<br>Teaching AI development to beginners</span>',
    artifacts_title: 'Ships',
    writing_title: 'Writing',
    social_title: 'Social',
    artifacts: [
      { label: 'Typevoise · macOS voice input', href: 'https://github.com/diaojz' },
      { label: 'AI Gateway · Claude Code relay', href: 'https://gw.diaoye.org' }
    ],
    howto:
      '<div class="entry-text">' +
      'howto · how to play\n\n' +
      'keyboard (desktop):\n' +
      '  D — day · warm white\n' +
      '  N — night · default black\n' +
      '  S — summer · falling leaves + forest\n' +
      '  M — midnight · moon + night sounds\n' +
      '  R — rain · cold grey + raindrops\n' +
      '  C — chaos · collapse all; press to restore\n\n' +
      '* silent? click the page once' +
      '</div>',
    howto_mobile:
      '<div class="entry-text">' +
      'howto · how to play\n\n' +
      'tap the logo letters:\n' +
      '  C — day · warm white\n' +
      '  B — summer / rain (tap to cycle)\n' +
      '  E — night / midnight (tap to cycle)\n' +
      '  I — chaos · tap again to restore\n\n' +
      '* silent? tap the screen once' +
      '</div>',
    social: [
      { label: 'GitHub/diaojz', href: 'https://github.com/diaojz' },
      { label: 'mail/hi@chengbei.org', href: 'mailto:hi@chengbei.org' }
    ],
    error_loading: 'failed to load content'
  }
};

window.CURRENT_LANG = 'zh';

function applyI18n(lang) {
  const dict = window.I18N[lang];
  if (!dict) return;
  window.CURRENT_LANG = lang;
  document.documentElement.setAttribute('lang', lang);
  document.title = dict.title;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    let key = el.dataset.i18n;
    if (key === 'howto' && isMobile && dict.howto_mobile != null) {
      key = 'howto_mobile';
    }
    if (dict[key] == null) return;
    el.innerHTML = dict[key];
  });

  renderLinks('artifacts-links', dict.artifacts);
  renderLinks('social-links', dict.social);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  if (typeof window.rerenderSiteData === 'function') {
    window.rerenderSiteData();
  }
}

function renderLinks(containerId, list) {
  const c = document.getElementById(containerId);
  if (!c || !Array.isArray(list)) return;
  c.innerHTML = list.map(item => {
    const isExternal = /^https?:\/\//.test(item.href);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${item.href}"${attrs}>${item.label}</a>`;
  }).join('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyI18n('zh'));
} else {
  applyI18n('zh');
}

window.matchMedia('(max-width: 768px)').addEventListener('change', () => {
  applyI18n(window.CURRENT_LANG);
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  e.preventDefault();
  applyI18n(btn.dataset.lang);
});
