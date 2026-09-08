import { cubicOut } from 'svelte/easing';
import { slide, type TransitionConfig } from 'svelte/transition';

type SlideEdgeProps = {
  duration?: number;
  axis?: 'x' | 'y';
};

export function slideEdge(
  node: Element,
  { duration = 150, axis = 'x' }: SlideEdgeProps = {},
): TransitionConfig {
  if (axis === 'y') {
    return slide(node, { duration, axis });
  }

  return {
    duration,
    easing: cubicOut,
    css: (t) =>
      `transform: translateX(calc(var(--rtl-sign, 1) * ${(1 - t) * 100}%));`,
  };
}
