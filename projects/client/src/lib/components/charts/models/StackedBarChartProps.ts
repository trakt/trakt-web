import type { Snippet } from 'svelte';

export type StackedBarChartData = {
  label: string;
  /** One value per series; index aligns with `seriesLabels`. */
  values: number[];
};

export type StackedTooltipArgs = {
  label: string;
  index: number;
  total: number;
  segments: { value: number; seriesIndex: number; label: string }[];
};

export type StackedBarChartProps = {
  data: StackedBarChartData[];
  /** Human label per series; index aligns with each datum's `values`. */
  seriesLabels?: string[];
  tickLabels?: string[];
  tooltip?: Snippet<[StackedTooltipArgs]>;
  /** Pixel gap between bars. Defaults to 2px. */
  barSpacing?: number;
  /** Accessible chart summary; rendered as a screen-reader figcaption. */
  label?: string;
  /** CSS height for the plot. Defaults to `var(--height-bar-chart)`. */
  height?: string;
};
