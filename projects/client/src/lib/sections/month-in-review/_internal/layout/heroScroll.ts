const isStacked = (node: HTMLElement) =>
  getComputedStyle(node).getPropertyValue('--hero-scroll-mode').trim() ===
  'stacked';

export function heroScroll(node: HTMLElement, isStatic: boolean) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hasScrollTimeline = CSS.supports('animation-timeline: view()');
  const state = { frame: 0, isStatic, isStacked: false, travel: 1 };

  const isScrollDriven = () =>
    hasScrollTimeline &&
    !state.isStatic &&
    !state.isStacked &&
    !reducedMotion.matches;

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
    node.classList.toggle('is-scroll-driven', isScrollDriven());

    if (state.isStatic || reducedMotion.matches || isScrollDriven()) {
      node.classList.remove('is-moving');
      return;
    }

    const top = node.getBoundingClientRect().top;
    const scrolled = state.isStacked ? window.scrollY : -top;
    const progress = Math.min(Math.max(scrolled / state.travel, 0), 1);

    node.classList.toggle('is-moving', progress > 0 && progress < 1);

    node.style.setProperty(
      state.isStacked ? '--deal' : '--p',
      progress.toFixed(3),
    );
  };

  const schedule = () => {
    if (state.frame || isScrollDriven()) return;
    state.frame = requestAnimationFrame(update);
  };

  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(state.frame);
    measure();
    update();
  });

  observer.observe(node);
  if (node.firstElementChild) observer.observe(node.firstElementChild);
  window.addEventListener('scroll', schedule, { passive: true });
  measure();
  update();

  return {
    update(next: boolean) {
      state.isStatic = next;
      measure();
      update();
    },
    destroy() {
      window.removeEventListener('scroll', schedule);
      observer.disconnect();
      cancelAnimationFrame(state.frame);
    },
  };
}
