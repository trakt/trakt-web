import type { Rgb } from '../models/Rgb.ts';

type Stop = readonly [heat: number, color: Rgb];

const COOLEST: Stop = [0, [120, 20, 10]];
const STOPS: ReadonlyArray<Stop> = [
  [1, [255, 250, 220]],
  [0.75, [255, 210, 120]],
  [0.5, [255, 140, 50]],
  [0.25, [230, 70, 20]],
  COOLEST,
];

const mix = (from: Rgb, to: Rgb, amount: number): Rgb => [
  from[0] + (to[0] - from[0]) * amount,
  from[1] + (to[1] - from[1]) * amount,
  from[2] + (to[2] - from[2]) * amount,
];

export function emberColor(heat: number): Rgb {
  const clamped = Math.min(1, Math.max(0, heat));
  const index = STOPS.findLastIndex(([at]) => at >= clamped);
  const [hotAt, hot] = STOPS[index] ?? COOLEST;
  const [coolAt, cool] = STOPS[index + 1] ?? [hotAt, hot];
  if (hotAt === coolAt) return hot;

  return mix(cool, hot, (clamped - coolAt) / (hotAt - coolAt));
}
