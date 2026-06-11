// ──────────────────────────────────────────────
// Quiet 模式 · 性能优先开关
// 关掉所有动效：氛围视频/音频、shader、CSS 动画、主题键
// 保留：D/N 纯换色、语言切换、阅读模式、文章跳转
// 状态存 localStorage（key: chengbei-quiet = '1' / 缺省）
// head 里有一段 inline script 已经提前打 html.quiet 防闪烁，本文件负责后续逻辑
// ──────────────────────────────────────────────

(function() {
  const KEY = 'chengbei-quiet';
  const html = document.documentElement;

  const OVERLAY_IDS = ['leaves-overlay', 'moon-overlay', 'rain-overlay'];
  const AUDIO_IDS   = ['forest-audio', 'night-audio', 'rain-audio'];
  const SRC_BACKUP  = new Map(); // id → 原始 src，便于退出时恢复

  function isQuiet() { return html.classList.contains('quiet'); }

  // 暂停并卸载所有氛围媒体；src 备份后清空，浏览器停止下载/解码
  function stopAllMedia() {
    [...OVERLAY_IDS, ...AUDIO_IDS].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      try { el.pause(); } catch (_) {}
      if (el.src && !SRC_BACKUP.has(id)) SRC_BACKUP.set(id, el.src);
      try { el.removeAttribute('src'); el.load(); } catch (_) {}
    });
  }

  // 恢复 src（仅恢复 attribute，是否自动播放交给 themes.js 的主题切换）
  function restoreMediaSrc() {
    SRC_BACKUP.forEach((src, id) => {
      const el = document.getElementById(id);
      if (el && !el.src) {
        el.src = src;
        try { el.load(); } catch (_) {}
      }
    });
  }

  // 进入 quiet：清主题相关 class + 停所有媒体 + 卸载全部图片 shader
  function enterQuiet() {
    html.classList.add('quiet');
    const cls = document.body.classList;
    cls.remove('leaves', 'midnight', 'rain');
    stopAllMedia();
    if (window.__shaders) window.__shaders.unmountAll();
    syncSwitch();
    try { localStorage.setItem(KEY, '1'); } catch (_) {}
  }

  // 退出 quiet：恢复 src（默认不开主题，用户自己按 S/M/R）+ 重挂图片 shader
  function exitQuiet() {
    html.classList.remove('quiet');
    restoreMediaSrc();
    if (window.__shaders) window.__shaders.mountAll();
    syncSwitch();
    try { localStorage.removeItem(KEY); } catch (_) {}
  }

  function toggleQuiet() { isQuiet() ? exitQuiet() : enterQuiet(); }

  // 同步开关按钮 active 态
  function syncSwitch() {
    const quiet = isQuiet();
    document.querySelectorAll('.motion-btn').forEach(btn => {
      btn.classList.toggle('active',
        (btn.dataset.motion === 'quiet' && quiet) ||
        (btn.dataset.motion === 'motion' && !quiet)
      );
    });
  }

  // DOM ready 后处理已经在 HTML 中默认开启的 leaves 模式
  function bootstrap() {
    if (isQuiet()) {
      // body 仍可能带 class="light leaves"（HTML 写死），强制清掉并停媒体
      document.body.classList.remove('leaves', 'midnight', 'rain');
      stopAllMedia();
    }
    syncSwitch();
  }

  // 开关按钮点击
  document.addEventListener('click', e => {
    const btn = e.target.closest('.motion-btn');
    if (!btn) return;
    e.preventDefault();
    if (btn.dataset.motion === 'quiet') enterQuiet();
    else exitQuiet();
  });

  // 快捷键 Q 切换（用 e.code 物理键位判断，中文输入法下 e.key 是 'Process' 会失灵）
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const k = (e.code === 'KeyQ') ? 'q' : (e.key || '').toLowerCase();
    if (k === 'q') toggleQuiet();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // 暴露给其它模块用
  window.__quiet = { isQuiet, enterQuiet, exitQuiet, toggleQuiet };
})();
