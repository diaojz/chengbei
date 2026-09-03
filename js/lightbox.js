// ──────────────────────────────────────────────
// 长文图片灯箱 — 事件委托 + 缩放 / 拖拽 / 图片切换
// ──────────────────────────────────────────────
(function () {
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const TOGGLE_SCALE = 2.2;
  let images = [];
  let index = 0;
  let scale = MIN_SCALE;
  let offsetX = 0;
  let offsetY = 0;
  let drag = null;
  let dragged = false;

  const lightbox = document.createElement('div');
  lightbox.id = 'post-lightbox';
  lightbox.className = 'post-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', '图片查看器');
  lightbox.innerHTML = `
    <button class="post-lightbox-close" type="button" aria-label="关闭图片查看器">×</button>
    <button class="post-lightbox-nav post-lightbox-prev" type="button" aria-label="上一张">←</button>
    <div class="post-lightbox-stage">
      <img class="post-lightbox-image" alt="">
    </div>
    <button class="post-lightbox-nav post-lightbox-next" type="button" aria-label="下一张">→</button>
    <div class="post-lightbox-info">
      <div class="post-lightbox-caption"></div>
      <div class="post-lightbox-count"></div>
    </div>`;
  document.body.appendChild(lightbox);

  const stage = lightbox.querySelector('.post-lightbox-stage');
  const image = lightbox.querySelector('.post-lightbox-image');
  const caption = lightbox.querySelector('.post-lightbox-caption');
  const count = lightbox.querySelector('.post-lightbox-count');
  const prev = lightbox.querySelector('.post-lightbox-prev');
  const next = lightbox.querySelector('.post-lightbox-next');

  function resetTransform() {
    scale = MIN_SCALE;
    offsetX = 0;
    offsetY = 0;
    drag = null;
    renderTransform();
  }

  function renderTransform() {
    image.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
    image.classList.toggle('is-zoomed', scale > MIN_SCALE);
    image.classList.toggle('is-dragging', Boolean(drag));
  }

  function sourceCaption(source) {
    const figure = source.closest('figure');
    const figcaption = figure && figure.querySelector('figcaption');
    return figcaption ? figcaption.textContent.trim() : '';
  }

  function showCurrent() {
    const source = images[index];
    if (!source) return;
    resetTransform();
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || '';
    const text = sourceCaption(source);
    caption.textContent = text;
    caption.hidden = !text;
    count.textContent = images.length > 1 ? `${index + 1} / ${images.length}` : '';
    count.hidden = images.length < 2;
    prev.hidden = images.length < 2;
    next.hidden = images.length < 2;
  }

  function open(source) {
    images = Array.from(document.querySelectorAll('#post-view .post-body img'));
    index = images.indexOf(source);
    if (index < 0) return;
    showCurrent();
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.classList.add('post-lightbox-open');
    lightbox.querySelector('.post-lightbox-close').focus();
  }

  function close() {
    if (lightbox.hidden) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('post-lightbox-open');
    lightbox.hidden = true;
    image.removeAttribute('src');
    resetTransform();
  }

  function move(step) {
    if (images.length < 2) return;
    index = (index + step + images.length) % images.length;
    showCurrent();
  }

  function setScale(nextScale) {
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    if (scale === MIN_SCALE) {
      offsetX = 0;
      offsetY = 0;
    }
    renderTransform();
  }

  document.addEventListener('click', e => {
    const source = e.target.closest('#post-view .post-body img');
    if (source) {
      open(source);
      return;
    }
    if (e.target.closest('.post-lightbox-close')) close();
    else if (e.target.closest('.post-lightbox-prev')) move(-1);
    else if (e.target.closest('.post-lightbox-next')) move(1);
    else if (e.target === lightbox || e.target === stage) close();
  });

  image.addEventListener('click', () => {
    if (dragged) {
      dragged = false;
      return;
    }
    setScale(scale > MIN_SCALE ? MIN_SCALE : TOGGLE_SCALE);
  });

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    setScale(scale * Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });

  image.addEventListener('pointerdown', e => {
    if (scale <= MIN_SCALE) return;
    e.preventDefault();
    image.setPointerCapture(e.pointerId);
    dragged = false;
    drag = { x: e.clientX, y: e.clientY, offsetX, offsetY };
    renderTransform();
  });

  image.addEventListener('pointermove', e => {
    if (!drag) return;
    if (Math.abs(e.clientX - drag.x) > 3 || Math.abs(e.clientY - drag.y) > 3) dragged = true;
    offsetX = drag.offsetX + e.clientX - drag.x;
    offsetY = drag.offsetY + e.clientY - drag.y;
    renderTransform();
  });

  function endDrag(e) {
    if (!drag) return;
    if (image.hasPointerCapture(e.pointerId)) image.releasePointerCapture(e.pointerId);
    drag = null;
    renderTransform();
  }
  image.addEventListener('pointerup', endDrag);
  image.addEventListener('pointercancel', endDrag);

  // capture 阶段优先于 posts.js 的 document keydown；Esc 只关闭灯箱。
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      close();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      move(1);
    }
  }, true);
})();
