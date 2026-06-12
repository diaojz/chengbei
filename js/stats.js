// ──────────────────────────────────────────────
// 访问统计 — GoatCounter（开源 · 无 Cookie）
// 计数：index.html 底部的 count.js 脚本
// 展示：第一栏底部「总访问 / 今日」，数据来自公开 counter API
// GoatCounter 未注册或接口未开放时整条隐藏，不影响页面
// ──────────────────────────────────────────────
(function () {
  const SITE = 'https://chengbei.goatcounter.com';

  async function fetchCount(query) {
    const res = await fetch(SITE + '/counter/TOTAL.json' + query);
    if (!res.ok) throw new Error('counter http ' + res.status);
    const data = await res.json();
    // count 形如 "1 234"（千位空格），统一去掉非数字字符
    return String(data.count || '').replace(/[^\d]/g, '');
  }

  async function render() {
    const box = document.getElementById('visit-stats');
    if (!box) return;
    try {
      const d = new Date();
      const today = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      const [total, day] = await Promise.all([
        fetchCount(''),
        fetchCount('?start=' + today),
      ]);
      if (!total) return;
      document.getElementById('stat-total').textContent = Number(total).toLocaleString();
      document.getElementById('stat-today').textContent = day ? Number(day).toLocaleString() : '0';
      box.hidden = false;
    } catch (e) {
      console.warn('[stats] 访问统计不可用', e);
    }
  }

  // SPA hash 路由切换（#/p/slug）也算一次浏览：count.js 默认只统计整页加载
  addEventListener('hashchange', function () {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: location.pathname + location.search + location.hash });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
