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
  const translate = (offset: number) =>
    axis === 'y'
      ? `translateY(${offset}%)`
      : `translateX(calc(var(--rtl-sign, 1) * ${offset}%))`;

  return {
    duration,
    easing: cubicOut,
    css: (t) => `transform: ${translate((1 - t) * 100)};`,
  };
}
