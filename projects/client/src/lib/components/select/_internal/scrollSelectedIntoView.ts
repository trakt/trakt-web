export type ScrollSelectedIntoViewParams = {
  isEnabled: boolean;
  isReducedMotion: boolean;
  target: HTMLElement | Nil;
};

function overflowOf(scroller: HTMLElement, target: HTMLElement) {
  const inset = parseFloat(getComputedStyle(scroller).paddingInlineStart) || 0;
  const box = scroller.getBoundingClientRect();
  const rect = target.getBoundingClientRect();

  if (rect.left < box.left + inset) {
    return rect.left - box.left - inset;
  }

  if (rect.right > box.right - inset) {
    return rect.right - box.right + inset;
  }

  return 0;
}

export function scrollSelectedIntoView(
  scroller: HTMLElement,
  initial: ScrollSelectedIntoViewParams,
) {
  let params = initial;
  let hasScrolled = false;
  let frame = 0;

  const scroll = () => {
    const { isEnabled, target } = params;
    if (!isEnabled || !target) return;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const left = overflowOf(scroller, target);
      const isSmooth = hasScrolled && !params.isReducedMotion;
      hasScrolled = true;

      if (left === 0) return;

      scroller.scrollBy({ left, behavior: isSmooth ? 'smooth' : 'instant' });
    });
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== 'width') return;
    if (!params.target?.contains(event.target as Node)) return;

    scroll();
  };

  scroller.addEventListener('transitionend', onTransitionEnd);
  scroll();

  return {
    update(next: ScrollSelectedIntoViewParams) {
      const previous = params;
      params = next;

      if (next.target === previous.target) return;

      scroll();
    },
    destroy() {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('transitionend', onTransitionEnd);
    },
  };
}
