import { clamp } from '$lib/utils/number/clamp.ts';

const FLIP_START = 0.45;
const FLIP_SPAN = 0.3;

export function flipRotation(progress: number, isHybrid: boolean): number {
  if (!isHybrid) return 0;

  return clamp({
    value: ((progress - FLIP_START) / FLIP_SPAN) * 180,
    min: 0,
    max: 180,
  });
}
