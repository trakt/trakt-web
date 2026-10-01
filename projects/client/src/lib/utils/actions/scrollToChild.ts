import { tick } from 'svelte';

type ScrollToChildParams = {
  index?: number;
  /** Changing it scrolls again even when the index is unchanged. */
  key?: unknown;
};

/**
 * Scrolls the node so the child at `index` sits where the first child rests
 * at scroll 0, keeping the list's own inset. Runs on mount and whenever the
 * params change; `undefined` leaves the scroll alone.
 * Measured from rects so it holds for RTL lists, where `scrollLeft` is negative.
 */
export function scrollToChild(node: HTMLElement, params?: ScrollToChildParams) {
  const scroll = (next?: ScrollToChildParams) => {
    const target = next?.index;
    if (target == null) return;

    tick().then(() => {
      const child = node.children.item(target);
      if (!child) return;

      const style = getComputedStyle(node);

      /* Snap points align to the padding edge, which would eat the inset. */
      node.style.scrollPaddingInlineStart = style.paddingInlineStart;

      const first = node.children.item(0)?.getBoundingClientRect();
      if (!first) return;

      const rect = child.getBoundingClientRect();
      const isRtl = style.direction === 'rtl';
      const left = isRtl ? rect.right - first.right : rect.left - first.left;

      node.scrollTo({ left, behavior: 'instant' });
    });
  };

  scroll(params);

  return {
    update: scroll,
  };
}
