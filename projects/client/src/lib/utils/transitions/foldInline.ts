import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type FoldInlineProps = {
  duration?: number;
  delay?: number;
  side?: 'start' | 'end';
};

/*
  Folds an inline item's width away while it fades, taking the flex gap on
  the given side with it, so its neighbours glide into the space instead of
  jumping once it is gone (and glide back out as it arrives).
*/
export function foldInline(
  node: HTMLElement,
  { duration = 360, delay = 0, side = 'end' }: FoldInlineProps = {},
): TransitionConfig {
  const isReducedMotion = Boolean(
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  const margin = side === 'start' ? 'margin-inline-start' : 'margin-inline-end';
  const width = node.offsetWidth;
  const base = parseFloat(getComputedStyle(node)[marginProperty(side)]) || 0;
  const gap = node.parentElement
    ? parseFloat(getComputedStyle(node.parentElement).columnGap) || 0
    : 0;

  return {
    delay,
    duration: isReducedMotion ? 0 : duration,
    easing: cubicOut,
    css: (t, u) =>
      `flex: none; min-width: 0; width: ${width * t}px; ` +
      `${margin}: ${base * t - gap * u}px; opacity: ${t};`,
  };
}

function marginProperty(side: 'start' | 'end') {
  return side === 'start' ? 'marginInlineStart' : 'marginInlineEnd';
}
