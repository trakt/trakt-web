import type { Snippet } from 'svelte';
import type { VizPoint } from './VizPoint.ts';
import type { VizTooltipArgs } from './VizTooltipArgs.ts';

type AreaChartData = VizPoint;

export type TooltipArgs = VizTooltipArgs;

export type AreaChartProps = {
  data: AreaChartData[];
  tooltip?: Snippet<[TooltipArgs]>;
  /**
   * Zero-based series slot driving color + hatch pattern via `--viz-*` tokens.
   * Ignored for any color explicitly supplied below.
   */
  seriesIndex?: number;
  /** CSS color used for the line stroke. Defaults to the seriesIndex token. */
  lineColor?: string;
  /** CSS color used to fill the area beneath the line. */
  fillColor?: string;
  /** CSS color used for the hover marker dot. Falls back to `lineColor`. */
  dotColor?: string;
  /** CSS color used for the hover marker dot's outer halo. */
  dotHaloColor?: string;
  /** Accessible chart summary; rendered as a screen-reader figcaption. */
  label?: string;
  /** CSS height for the plot. Defaults to `var(--height-area-chart)`. */
  height?: string;
};
