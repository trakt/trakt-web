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
