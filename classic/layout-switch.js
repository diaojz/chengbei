(() => {
  const layoutSwitch = document.querySelector('[data-layout-switch]');
  layoutSwitch?.addEventListener('click', () => {
    localStorage.setItem('chengbei-layout', 'product');
  });
})();
