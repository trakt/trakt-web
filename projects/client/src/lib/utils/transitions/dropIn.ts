import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type DropInProps = {
  axis?: 'x' | 'y';
  duration?: number;
  delay?: number;
  offset?: number;
};

const GAP_SEARCH_DEPTH = 3;

function resolveFlowGap(node: Element): number {
  let parent = node.parentElement;

  for (let depth = 0; parent && depth < GAP_SEARCH_DEPTH; depth += 1) {
    const gap = parseFloat(getComputedStyle(parent).rowGap);
    if (gap > 0) return gap;
    parent = parent.parentElement;
  }

  return 0;
}

/*
  Drops an element in from the top edge and takes it back out the same way,
  collapsing the box it occupies along `axis` so the neighbours slide instead
  of jumping. On the `y` axis the parent's flex gap is compensated with a
  negative margin, so a removed row leaves no seam behind.
*/
export function dropIn(
  node: Element,
  { axis = 'y', duration = 240, delay = 0, offset = 16 }: DropInProps = {},
): TransitionConfig {
  const style = getComputedStyle(node);
  const size = parseFloat(axis === 'y' ? style.height : style.width) || 0;
  const gap = axis === 'y' ? resolveFlowGap(node) : 0;
  const limit = axis === 'y' ? 'max-height' : 'max-width';

  return {
    delay,
    duration,
    easing: cubicOut,
    css: (t, u) =>
      `${limit}: ${t * size}px;` +
      `margin-bottom: ${-u * gap}px;` +
      'overflow: hidden;' +
      `opacity: ${t};` +
      `transform: translateY(${-u * offset}px);`,
  };
}
