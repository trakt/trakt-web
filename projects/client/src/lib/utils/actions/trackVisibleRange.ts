import type { VisibleRange } from './VisibleRange.ts';

const EDGE_TOLERANCE_PX = 2;

type Bounds = {
  left: number;
  right: number;
};

function isFullyVisible(
  { child, container }: { child: Element; container: Bounds },
) {
  const rect = child.getBoundingClientRect();

  return rect.left >= container.left - EDGE_TOLERANCE_PX &&
    rect.right <= container.right + EDGE_TOLERANCE_PX;
}

function getContentBounds(node: HTMLElement): Bounds {
  const rect = node.getBoundingClientRect();
  const style = getComputedStyle(node);

  return {
    left: rect.left + (parseFloat(style.paddingLeft) || 0),
    right: rect.right - (parseFloat(style.paddingRight) || 0),
  };
}

/**
 * Indices of the first and last children that sit fully inside the node's
 * viewport, between its gutters, or `undefined` when none do.
 */
function getVisibleRange(node: HTMLElement): VisibleRange | undefined {
  const container = getContentBounds(node);
  const visible = Array.from(node.children)
    .map((child, index) => ({
      index,
      isVisible: isFullyVisible({ child, container }),
    }))
    .filter(({ isVisible }) => isVisible);

  const first = visible.at(0);
  const last = visible.at(-1);

  if (!first || !last) return undefined;

  return { first: first.index, last: last.index };
}

/**
 * Dispatches a `visiblerange` event with the indices of the first and last
 * fully visible children whenever scrolling, resizing or a child change moves
 * them. Direction-agnostic, so it holds for RTL lists.
 */
export function trackVisibleRange(node: HTMLElement, isEnabled = true) {
  if (!isEnabled) return {};

  const state = {
    frame: 0,
    last: undefined as VisibleRange | undefined,
  };

  const emit = () => {
    state.frame = 0;

    const range = getVisibleRange(node);
    if (!range) return;
    if (range.first === state.last?.first && range.last === state.last?.last) {
      return;
    }

    state.last = range;
    node.dispatchEvent(new CustomEvent('visiblerange', { detail: range }));
  };

  const schedule = () => {
    if (state.frame) return;
    state.frame = requestAnimationFrame(emit);
  };

  const resizeObserver = new ResizeObserver(schedule);
  const mutationObserver = new MutationObserver(schedule);

  resizeObserver.observe(node);
  mutationObserver.observe(node, { childList: true });
  node.addEventListener('scroll', schedule, { passive: true });
  schedule();

  return {
    destroy() {
      cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      node.removeEventListener('scroll', schedule);
    },
  };
}
