import type { Snippet } from 'svelte';

type BarChartData = {
  value: number;
  label: string;
};

export type TooltipArgs = { value: number; label: string; index: number };

export type BarChartProps = {
  data: BarChartData[];
  tickLabels?: string[];
  tooltip?: Snippet<[TooltipArgs]>;
  /** Pixel gap between bars. Defaults to 2px. */
  barSpacing?: number;
};
