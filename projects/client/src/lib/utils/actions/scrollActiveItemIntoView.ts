const scrollOffset = 8;

type ScrollActiveItemParams = {
  active: boolean;
  /**
   * Which way the item's container scrolls.
   *
   * `inline` (the default) nudges a horizontal rail by its own scrollLeft,
   * which is the only way to move a masked strip. `block` hands off to
   * `scrollIntoView`, which finds whichever ancestor scrolls vertically - a
   * drawer's body, usually, several levels up from the item.
   */
  axis?: 'inline' | 'block';
};

export function scrollActiveItemIntoView(
  element: HTMLElement,
  params: ScrollActiveItemParams,
) {
  let rafId: number | null = null;

  const scrollBlock = (behavior: 'smooth' | 'instant') => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      element.scrollIntoView({ block: 'start', behavior });
    });
  };

  const scrollInline = (behavior: 'smooth' | 'instant') => {
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

  const doScroll = (
    { active, axis = 'inline' }: ScrollActiveItemParams,
    behavior: 'smooth' | 'instant',
  ) => {
    if (!active) return;

    if (axis === 'block') {
      scrollBlock(behavior);
      return;
    }

    scrollInline(behavior);
  };

  doScroll(params, 'instant');

  return {
    update: (next: ScrollActiveItemParams) => {
      doScroll(next, 'smooth');
    },
    destroy: () => {
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
