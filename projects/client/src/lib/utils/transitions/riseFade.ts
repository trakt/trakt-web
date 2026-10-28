import { cubicOut } from 'svelte/easing';

type RiseFadeProps = {
  delay?: number;
  duration?: number;
  /** How far the element travels, in px. Small on purpose - see below. */
  distance?: number;
};

/*
  Durations in milliseconds rather than the `--transition-*` tokens, because a
  Svelte transition is computed in JS and cannot read a custom property. Kept in
  the same range as `--transition-increment` so it feels of a piece with the CSS
  transitions around it.
*/
const DEFAULT_DURATION = 280;
const DEFAULT_DISTANCE = 6;

/** Enough to register as motion, short enough not to feel like waiting. */
const REDUCED_MOTION_DURATION = 120;

function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
    false;
}

/**
 * An entrance for content that arrives after its surroundings - a value that had
 * to be fetched, most often. Fades up a few pixels and settles.
 *
 * The distance is deliberately tiny. The point is to make the arrival legible, not
 * to draw attention to it: something that flies in reads as an animation, whereas
 * something that surfaces reads as having loaded. Anything past ~8px starts to
 * feel like the former.
 *
 * `cubicOut` because an entrance should decelerate into place. Easing in as well
 * makes the element look hesitant.
 *
 * Under `prefers-reduced-motion` the travel is dropped entirely and the fade is
 * shortened, rather than the transition being skipped - the element still needs to
 * not simply blink into existence. This has to be checked here rather than in CSS:
 * a Svelte transition runs in JS, so a media query cannot reach it.
 */
export function riseFade(
  _node: Element,
  {
    delay = 0,
    duration = DEFAULT_DURATION,
    distance = DEFAULT_DISTANCE,
  }: RiseFadeProps = {},
) {
  const isReduced = prefersReducedMotion();
  const travel = isReduced ? 0 : distance;

  return {
    delay,
    duration: isReduced ? REDUCED_MOTION_DURATION : duration,
    easing: cubicOut,
    css: (t: number) =>
      `opacity: ${t}; transform: translateY(${(1 - t) * travel}px);`,
  };
}
