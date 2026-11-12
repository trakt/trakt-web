const isStacked = (node: HTMLElement) =>
  getComputedStyle(node).getPropertyValue('--hero-scroll-mode').trim() ===
  'stacked';

export function heroScroll(node: HTMLElement, isStatic: boolean) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { frame: 0, isStatic, isStacked: false, travel: 1 };

  const measure = () => {
    const stage =
      node.firstElementChild instanceof HTMLElement
        ? node.firstElementChild.offsetHeight
        : window.innerHeight;

    state.isStacked = isStacked(node);
    state.travel = Math.max(
      state.isStacked ? node.offsetHeight * 0.3 : node.offsetHeight - stage,
      1,
    );
  };

  const update = () => {
    state.frame = 0;

    node.style.removeProperty('--p');
    node.style.removeProperty('--deal');

    if (state.isStatic || reducedMotion.matches) return;

    const top = node.getBoundingClientRect().top;
    const scrolled = state.isStacked ? window.scrollY : -top;
    const progress = Math.min(Math.max(scrolled / state.travel, 0), 1);

    node.style.setProperty(
      state.isStacked ? '--deal' : '--p',
      progress.toFixed(3),
    );
  };

  const schedule = () => {
    if (state.frame) return;
    state.frame = requestAnimationFrame(update);
  };

  const observer = new ResizeObserver(() => {
    measure();
    schedule();
  });

  observer.observe(node);
  if (node.firstElementChild) observer.observe(node.firstElementChild);
  window.addEventListener('scroll', schedule, { passive: true });
  measure();
  update();

  return {
    update(next: boolean) {
      state.isStatic = next;
      update();
    },
    destroy() {
      window.removeEventListener('scroll', schedule);
      observer.disconnect();
      cancelAnimationFrame(state.frame);
    },
  };
}
