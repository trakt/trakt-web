import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type SlideEdgeProps = {
  duration?: number;
  axis?: 'x' | 'y';
};

export function slideEdge(
  _node: Element,
  { duration = 150, axis = 'x' }: SlideEdgeProps = {},
): TransitionConfig {
  if (axis === 'y') {
    return {
      duration,
      easing: cubicOut,
      css: (t) => `transform: translateY(${(1 - t) * 100}%);`,
    };
  }

  return {
    duration,
    easing: cubicOut,
    css: (t) =>
      `transform: translateX(calc(var(--rtl-sign, 1) * ${(1 - t) * 100}%));`,
  };
}
