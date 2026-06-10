import type { Snippet } from 'svelte';
import type { VizPoint } from './VizPoint.ts';
import type { VizTooltipArgs } from './VizTooltipArgs.ts';

export type LineChartData = VizPoint;

export type TooltipArgs = VizTooltipArgs;

export type LineChartProps = {
  data: LineChartData[];
  tooltip?: Snippet<[TooltipArgs]>;
  /**
   * Zero-based series slot driving color + high-contrast hatch pattern via the
   * `--viz-*` tokens. Wraps past eight series. Ignored when `color` is set.
   */
  seriesIndex?: number;
  /** Explicit CSS color override; defaults to the `seriesIndex` viz token. */
  color?: string;
  /** Fill the area beneath the line (turns the primitive into an area chart). */
  showArea?: boolean;
  /**
   * Y-value the domain floors at and the area fills down to. Defaults to
   * `min(0, dataMin)`. Set a non-zero floor (e.g. 60 for a 60-100 ratings
   * range) to zoom the line into its meaningful band.
   */
  baseline?: number;
  /** Render a static marker at every data point, not just the active one. */
  showDots?: boolean;
  /** Sparse labels rendered under the axis; index-aligned, empty strings skipped. */
  tickLabels?: string[];
  /** CSS color for the area fill; defaults to a `color` vertical fade gradient. */
  fillColor?: string;
  /** CSS color for the hover/pin marker dot. Defaults to `color`. */
  dotColor?: string;
  /** CSS color for the marker dot's outer halo. */
  dotHaloColor?: string;
  /** Accessible chart summary; also rendered as the screen-reader figcaption. */
  label?: string;
  /** CSS height for the plot. Defaults to `var(--height-area-chart)`. */
  height?: string;
};
