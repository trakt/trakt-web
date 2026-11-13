import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type FadeAwayProps = {
  duration?: number;
  delay?: number;
};

/*
  An outro that lifts the leaving block out of the flow and fades it, so the
  block arriving in its place takes the layout at once and the two cross
  instead of stacking.
*/
export function fadeAway(
  _node: HTMLElement,
  { duration = 240, delay = 0 }: FadeAwayProps = {},
): TransitionConfig {
  const isReducedMotion = Boolean(
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );

  return {
    delay,
    duration: isReducedMotion ? 0 : duration,
    easing: cubicOut,
    css: (t) =>
      'position: absolute; inset-block-start: 0; inset-inline: 0; ' +
      `opacity: ${t}; pointer-events: none;`,
  };
}
