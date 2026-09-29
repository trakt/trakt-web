import { clamp } from '$lib/utils/number/clamp.ts';

const HOLD = 0.04;
const SPAN = 0.9;

export function monthIndexFor(progress: number, count: number): number {
  if (count <= 0) return 0;

  const held = clamp({ value: (progress - HOLD) / SPAN, min: 0, max: 1 });
  return Math.min(count - 1, Math.floor(held * count));
}
