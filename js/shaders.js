// ──────────────────────────────────────────────
// HalftoneDots shader — 常开版（性能开关交给安静模式）
// 图片/视频默认就挂 WebGL halftone 动效
// 省电手段：1) IntersectionObserver 出视口自动暂停渲染（卸 RAF）
//          2) 安静模式（html.quiet）一键全部卸载，退出后重挂
// CDN_VERSION: 18.3.1 — 改版本要同步改此文件 line 8-10（3 处 import）和 index.html（3 处 modulepreload），共 6 处
// ──────────────────────────────────────────────
import React from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { HalftoneDots } from 'https://esm.sh/@paper-design/shaders-react@0.0.72?deps=react@18.3.1,react-dom@18.3.1';

const shaderProps = {
  contrast: 0.4, originalColors: false, inverted: false,
  grid: 'hex', radius: 1, size: 0.2, scale: 1,
  grainSize: 0.5, type: 'gooey', fit: 'cover',
  grainMixer: 0.2, grainOverlay: 0.2,
  colorFront: '#2B2B2B', colorBack: '#00000000',
  style: { width: '100%', height: '100%', backgroundColor: '#F2F1E8' },
};

const videoShaderProps = {
  ...shaderProps,
  style: { width: '100%', height: '100%', backgroundColor: 'transparent' },
};

const shaderRegistry = new Map();

const isQuiet = () => document.documentElement.classList.contains('quiet');

// 出视口暂停渲染（render null 卸掉 RAF），回视口恢复
const visibilityObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    const data = shaderRegistry.get(target);
    if (!data) return;
    data.root.render(isIntersecting
      ? React.createElement(HalftoneDots, data.props)
      : null
    );
  });
}, { rootMargin: '150px' });

async function mountShader(wrap, props) {
  if (wrap._shaderStarted) return;
  // 安静模式下不挂 shader，用 CSS hex 点阵占位
  if (isQuiet()) return;
  const slide = wrap.closest('.gallery-slide');
  if (slide && !slide.classList.contains('active')) return;
  wrap._shaderStarted = true;
  const img     = wrap.querySelector('img');
  const overlay = wrap.querySelector('.shader-overlay');
  if (!overlay) { wrap._shaderStarted = false; return; }

  let finalProps = props;
  if (img) {
    await new Promise(r => {
      if (img.complete && img.naturalWidth > 0) r();
      else img.addEventListener('load', r, { once: true });
    });
    finalProps = { ...props, image: img.src };
  }
  // 等图期间用户可能开了安静模式
  if (isQuiet()) { wrap._shaderStarted = false; return; }

  try {
    const root = createRoot(overlay);
    root.render(React.createElement(HalftoneDots, finalProps));
    shaderRegistry.set(wrap, { root, props: finalProps });
    visibilityObserver.observe(wrap);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    wrap.dataset.shaderInit = '1';
  } catch (e) {
    console.warn('Shader failed:', e);
    overlay.remove();
    wrap.dataset.shaderInit = '1';
  }
}

function unmountShader(wrap) {
  const data = shaderRegistry.get(wrap);
  if (!data) return;
  visibilityObserver.unobserve(wrap);
  try { data.root.unmount(); } catch {}
  shaderRegistry.delete(wrap);
  delete wrap.dataset.shaderInit;
  wrap._shaderStarted = false;
}

// 给 quiet.js 用：进安静模式全卸，退出后重挂
function mountAll() {
  document.querySelectorAll('#col-images .img-wrap').forEach(w => mountShader(w, shaderProps));
  document.querySelectorAll('#col-thoughts .video-wrap').forEach(w => mountShader(w, videoShaderProps));
}
function unmountAll() {
  [...shaderRegistry.keys()].forEach(unmountShader);
}
window.__shaders = { mountAll, unmountAll };

// MutationObserver: 新增的 .img-wrap / .video-wrap 直接挂 shader
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;
      node.querySelectorAll?.('.img-wrap').forEach(w => mountShader(w, shaderProps));
      node.querySelectorAll?.('.video-wrap').forEach(w => mountShader(w, videoShaderProps));
    }
  }
});
const col3 = document.getElementById('col-images');
const col2 = document.getElementById('col-thoughts');
if (col3) observer.observe(col3, { childList: true, subtree: true });
if (col2) observer.observe(col2, { childList: true, subtree: true });

mountAll();

// 兼容老接口：app.js 画廊翻页时调用，让新 active slide 挂上
window._initShader = wrap => mountShader(wrap, shaderProps);
