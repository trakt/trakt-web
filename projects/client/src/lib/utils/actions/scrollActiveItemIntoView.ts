const scrollOffset = 8;
export function scrollActiveItemIntoView(
  element: HTMLElement,
  active: boolean,
) {
  let rafId: number | null = null;

  const doScroll = (active: boolean, behavior: 'smooth' | 'instant') => {
    if (!active) return;

    const parent = element.parentElement;
    if (!parent) return;

    const parentRight = parent.scrollLeft + parent.clientWidth;
    const elementLeft = element.offsetLeft;
    const elementRight = elementLeft + element.offsetWidth;
    const isOutOfView = elementRight > parentRight ||
      elementLeft < parent.scrollLeft;

    if (!isOutOfView) return;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      parent.scrollTo({
        left: elementLeft - scrollOffset,
        behavior,
      });
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
