const scrollOffset = 8;

function getOffsetInScroller(element: HTMLElement, scroller: HTMLElement) {
  const elementRect = element.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();
  const left = scroller.scrollLeft + elementRect.left - scrollerRect.left;

  return { left, right: left + elementRect.width };
}

export function scrollActiveItemIntoView(
  element: HTMLElement,
  active: boolean,
) {
  let rafId: number | null = null;

  const doScroll = (active: boolean, behavior: 'smooth' | 'instant') => {
    if (!active) return;

    if (rafId) cancelAnimationFrame(rafId);

    // Measured after layout so siblings and late-loading content are settled.
    rafId = requestAnimationFrame(() => {
      const parent = element.parentElement;
      if (!parent) return;

      const { left, right } = getOffsetInScroller(element, parent);
      const isOutOfView = right > parent.scrollLeft + parent.clientWidth ||
        left < parent.scrollLeft;
      if (!isOutOfView) return;

      parent.scrollTo({ left: left - scrollOffset, behavior });
    });
  };

  doScroll(active, 'instant');

  return {
    update: (active: boolean) => {
      doScroll(active, 'smooth');
    },
    destroy: () => {
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
