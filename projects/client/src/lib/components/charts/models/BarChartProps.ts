import type { Snippet } from 'svelte';
import type { VizPoint } from './VizPoint.ts';
import type { VizTooltipArgs } from './VizTooltipArgs.ts';

type BarChartData = VizPoint;

export type TooltipArgs = VizTooltipArgs;

export type BarChartProps = {
  data: BarChartData[];
  /** Sparse labels rendered under the axis; empty strings are skipped. */
  tickLabels?: string[];
  tooltip?: Snippet<[TooltipArgs]>;
  /** Pixel gap between bars. Defaults to 2px. */
  barSpacing?: number;
  /** Zero-based series slot driving color + hatch pattern via `--viz-*`. */
  seriesIndex?: number;
  /**
   * Highlight the tallest bar at full strength and dim the rest. Defaults to
   * true; set false for an evenly-weighted distribution.
   */
  highlightPeak?: boolean;
  /** Accessible chart summary; rendered as a screen-reader figcaption. */
  label?: string;
  /** CSS height for the plot. Defaults to `var(--height-bar-chart)`. */
  height?: string;
};
