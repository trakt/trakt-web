import { cubicIn } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { time } from '$lib/utils/timing/time.ts';

type RollParams = {
  direction: 'in' | 'out';
};

const spring = (progress: number) => {
  const overshoot = 1.7;
  const remaining = progress - 1;
  return remaining * remaining * ((overshoot + 1) * remaining + overshoot) + 1;
};

export function reactionRoll(
  _node: Element,
  { direction }: RollParams,
): TransitionConfig {
  if (direction === 'out') {
    return {
      duration: time.seconds(0.25),
      easing: cubicIn,
      css: (t, u) =>
        `transform: translateY(${-70 * u}%) rotate(${-18 * u}deg) scale(${
          1 - 0.4 * u
        }); opacity: ${t};`,
    };
  }

  return {
    delay: time.seconds(0.1),
    duration: time.seconds(0.45),
    easing: spring,
    css: (t, u) =>
      `transform: translateY(${70 * u}%) rotate(${18 * u}deg) scale(${
        0.6 + 0.4 * t
      }); opacity: ${Math.min(1, t * 2)};`,
  };
}
