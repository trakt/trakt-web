import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type NudgeInlineProps = {
  duration?: number;
  delay?: number;
};

/*
  Moves an inline item in or out without touching its box: its own width
  (and the gap after it) is pulled into a negative end margin while it is
  faded, so the items after it glide over the space instead of jumping,
  and anything aimed at the item (a flying poster) still lands on it.
*/
export function nudgeInline(
  node: HTMLElement,
  { duration = 320, delay = 0 }: NudgeInlineProps = {},
): TransitionConfig {
  const isReducedMotion = Boolean(
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  const width = node.offsetWidth;
  const base = parseFloat(getComputedStyle(node).marginInlineEnd) || 0;
  const gap = node.parentElement
    ? parseFloat(getComputedStyle(node.parentElement).columnGap) || 0
    : 0;

  return {
    delay,
    duration: isReducedMotion ? 0 : duration,
    easing: cubicOut,
    css: (t, u) =>
      `margin-inline-end: ${base * t - (width + gap) * u}px; opacity: ${t};`,
  };
}
