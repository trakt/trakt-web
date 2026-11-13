import type { TransitionConfig } from 'svelte/transition';

const DURATION = 240;
const REST_SCALE = 0.94;

/*
  The navbar's centre surface swaps between the content toggle and the mixtape
  deck. The leaving surface settles down and fades while the arriving one
  takes its place, both on the compositor.
*/
export function navbarSurfaceTransition(_node: Element): TransitionConfig {
  const isReducedMotion = globalThis.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  return {
    duration: isReducedMotion ? 0 : DURATION,
    css: (t) =>
      `opacity: ${t}; transform: scale(${REST_SCALE + (1 - REST_SCALE) * t})`,
  };
}
