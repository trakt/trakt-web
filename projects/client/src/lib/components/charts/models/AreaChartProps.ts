import type { Snippet } from 'svelte';

type AreaChartData = {
  value: number;
  label: string;
};

export type TooltipArgs = { value: number; label: string; index: number };

export type AreaChartProps = {
  data: AreaChartData[];
  tooltip?: Snippet<[TooltipArgs]>;
  /** CSS color used for the line stroke. */
  lineColor?: string;
  /** CSS color used to fill the area beneath the line. */
  fillColor?: string;
  /** CSS color used for the hover marker dot. Falls back to `lineColor`. */
  dotColor?: string;
  /** CSS color used for the hover marker dot's outer halo. */
  dotHaloColor?: string;
};
