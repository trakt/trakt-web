import type { HeatmapIntensity } from '$lib/sections/stats/_internal/models/HeatmapIntensity.ts';

export type HeatmapCell = {
  readonly date: Date;
  readonly count: number;
  readonly intensity: HeatmapIntensity;
  readonly col: number; // 0–6, day of week (Sun=0)
  readonly row: number; // 0–5, week of month
  readonly isFuture: boolean;
  readonly isToday: boolean;
};
