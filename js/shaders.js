// ──────────────────────────────────────────────
// HalftoneDots shader — Hover 启动版（性能优化）
// 默认所有图片不跑 shader, 由 CSS hex 点阵占位 (styles.css :not([data-shader-init]))
// 鼠标 hover 到某张图才启动真 WebGL halftone, 离开卸载
// 4 张图同时跑 → 最多 1 张, CPU/GPU 占用大幅下降
// Touch 设备完全跳过 shader (无 hover 能力, 直接用 CSS 点阵)
// CDN_VERSION: 18.3.1 — 改版本要同步改此文件 line 9-11（3 处 import）和 index.html line 20-22（3 处 modulepreload）
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

// Touch 设备 (无 hover) 跳过整套 shader 机制, 只用 CSS 点阵 — 移动端更省电
const SUPPORTS_HOVER = window.matchMedia('(hover: hover)').matches;

async function mountShader(wrap, props) {
  if (wrap._shaderStarted) return;
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

  try {
    const root = createRoot(overlay);
    root.render(React.createElement(HalftoneDots, finalProps));
    shaderRegistry.set(wrap, { root });
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
  try { data.root.unmount(); } catch {}
  shaderRegistry.delete(wrap);
  delete wrap.dataset.shaderInit;
  wrap._shaderStarted = false;
}

function attachHoverTrigger(wrap, props) {
  if (wrap.dataset.hoverAttached) return;
  wrap.dataset.hoverAttached = '1';
  if (!SUPPORTS_HOVER) return;  // touch 设备保持 CSS 点阵, 不启用 shader

  let pending = false;
  wrap.addEventListener('mouseenter', () => {
    if (pending || shaderRegistry.has(wrap)) return;
    pending = true;
    mountShader(wrap, props).finally(() => { pending = false; });
  });
  wrap.addEventListener('mouseleave', () => {
    unmountShader(wrap);
  });
}

// MutationObserver: 新增的 .img-wrap / .video-wrap 自动挂 hover trigger
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;
      node.querySelectorAll?.('.img-wrap').forEach(w => attachHoverTrigger(w, shaderProps));
      node.querySelectorAll?.('.video-wrap').forEach(w => attachHoverTrigger(w, videoShaderProps));
    }
  }
});
const col3 = document.getElementById('col-images');
const col2 = document.getElementById('col-thoughts');
if (col3) observer.observe(col3, { childList: true, subtree: true });
if (col2) observer.observe(col2, { childList: true, subtree: true });

document.querySelectorAll('#col-images .img-wrap').forEach(w => attachHoverTrigger(w, shaderProps));
document.querySelectorAll('#col-thoughts .video-wrap').forEach(w => attachHoverTrigger(w, videoShaderProps));

// 兼容老接口
window._initShader = wrap => mountShader(wrap, shaderProps);
