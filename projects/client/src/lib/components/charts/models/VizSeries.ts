import type { VizPoint } from './VizPoint.ts';

/**
 * A named collection of {@link VizPoint}s - the multi-series shape consumed by
 * stacked/grouped primitives. `seriesIndex` ties the series to a `--viz-{slot}`
 * color so the same series reads consistently across every chart it appears in.
 */
export type VizSeries = {
  /** Stable identity for keyed rendering; falls back to `label`. */
  id?: string;
  /** Human-readable series name (legend, tooltip, a11y). */
  label?: string;
  /** Zero-based palette slot driving color + hatch pattern. */
  seriesIndex?: number;
  points: VizPoint[];
};
