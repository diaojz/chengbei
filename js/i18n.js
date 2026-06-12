// ──────────────────────────────────────────────
// 国际化：中英双语
// 所有面向用户的文案都在这里。语言切换无刷新、不持久化。
// ──────────────────────────────────────────────
window.I18N = {
  zh: {
    title: '城北 · 个人站',
    intro: '城北<span class="intro-sub">独立开发者<br>把 AI 开发带给零基础学员</span>',
    artifacts_title: 'Ships',
    help_title: 'Help · 学员答疑',
    writing_title: 'Writing',
    social_title: 'Social',
    motion_btn: '动效',
    quiet_btn: '安静',
    stats_total: '总访问',
    stats_today: '今日',
    stats_link: '统计 ↗',
    read_more: '阅读全文 →',
    help: [
      { label: 'Claude 账号登录问题 · 完整解决方案', href: '#/p/claude-login-guide' },
      { label: 'Claude 登录常见问题 · FAQ', href: '#/p/claude-login-faq' }
    ],
    artifacts: [
      { label: 'Ghostty 终端配置 · 课件总览', href: '/ghostty-terminal/' },
      { label: 'Ghostty 配置清单 · 照抄即用', href: '/ghostty-checklist/' },
      { label: 'mini-harness · Harness 代码精讲', href: '/mini-harness/' },
      { label: '换电脑 · 苹果开发者账号迁移指南', href: '/apple-dev-migration/' },
      { label: 'App Store · 上架完整指南', href: 'https://news.diaoye.org' },
      { label: 'cc-doctor · 一键拯救 Claude Code', href: 'https://www.ccswitch.io' },
      { label: 'Balatro Web · 8 轮课程演示', href: 'https://diaojz.github.io/balatro-game/' },
      { label: 'Typevoise · macOS 语音输入', href: 'https://github.com/diaojz/Typevoise' },
      { label: 'Vibe Coding Survey · 调研问卷', href: 'https://vibe-coding-survey.vercel.app' }
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
      '  C — 混沌 · 一切坍塌，再按归位\n' +
      '  Q — 安静 · 关掉所有动效（省电）\n\n' +
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
      { label: '小红书/城北', href: 'https://www.xiaohongshu.com/user/profile/5c15f5c50000000005012559' }
    ],
    error_loading: '内容加载失败'
  },
  en: {
    title: 'Chengbei · Personal Site',
    intro: 'Chengbei<span class="intro-sub">Indie Hacker<br>Teaching AI development to beginners</span>',
    artifacts_title: 'Ships',
    help_title: 'Help · Student Support',
    writing_title: 'Writing',
    social_title: 'Social',
    motion_btn: 'motion',
    quiet_btn: 'quiet',
    stats_total: 'views',
    stats_today: 'today',
    stats_link: 'stats ↗',
    read_more: 'Read more →',
    help: [
      { label: 'Claude account login · full guide', href: '#/p/claude-login-guide' },
      { label: 'Claude login · FAQ', href: '#/p/claude-login-faq' }
    ],
    artifacts: [
      { label: 'Ghostty Terminal Setup · course deck', href: '/ghostty-terminal/' },
      { label: 'Ghostty Setup Checklist · copy & run', href: '/ghostty-checklist/' },
      { label: 'mini-harness · code deep-dive', href: '/mini-harness/' },
      { label: 'Apple Dev Migration · new Mac guide', href: '/apple-dev-migration/' },
      { label: 'App Store · launch guide', href: 'https://news.diaoye.org' },
      { label: 'cc-doctor · one-click Claude Code fix', href: 'https://www.ccswitch.io' },
      { label: 'Balatro Web · 8-lesson course demo', href: 'https://diaojz.github.io/balatro-game/' },
      { label: 'Typevoise · macOS voice input', href: 'https://github.com/diaojz/Typevoise' },
      { label: 'Vibe Coding Survey', href: 'https://vibe-coding-survey.vercel.app' }
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
      '  C — chaos · collapse all; press to restore\n' +
      '  Q — quiet · kill all motion (save power)\n\n' +
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
      { label: 'RedNote/城北', href: 'https://www.xiaohongshu.com/user/profile/5c15f5c50000000005012559' }
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
  renderLinks('help-links', dict.help);
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
