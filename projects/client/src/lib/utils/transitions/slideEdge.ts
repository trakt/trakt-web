import { cubicOut } from 'svelte/easing';
import type { EasingFunction, TransitionConfig } from 'svelte/transition';

type SlideEdgeProps = {
  duration?: number;
  axis?: 'x' | 'y';
  easing?: EasingFunction;
  overshoot?: string;
};

export function slideEdge(
  _node: Element,
  {
    duration = 150,
    axis = 'x',
    easing = cubicOut,
    overshoot,
  }: SlideEdgeProps = {},
): TransitionConfig {
  const distance = (progress: number) =>
    overshoot
      ? `calc(${progress * 100}% + ${overshoot} * ${progress})`
      : `${progress * 100}%`;

  const translate = (progress: number) =>
    axis === 'y'
      ? `translateY(${distance(progress)})`
      : `translateX(calc(var(--rtl-sign, 1) * ${distance(progress)}))`;

  return {
    duration,
    easing,
    css: (t) => `transform: ${translate(1 - t)};`,
  };
}
