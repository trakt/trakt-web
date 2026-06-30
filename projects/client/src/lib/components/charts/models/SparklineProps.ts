export type SparklineProps = {
  values: number[];
  /** Zero-based series slot driving color via `--viz-*`. Ignored if `color` set. */
  seriesIndex?: number;
  /** Explicit CSS color override; defaults to the `seriesIndex` viz token. */
  color?: string;
  /** Fill the area beneath the line with a vertical fade. */
  showArea?: boolean;
  /** Accessible summary; rendered as a screen-reader figcaption. */
  label?: string;
  /** CSS height for the sparkline. Defaults to `var(--ni-32)`. */
  height?: string;
};
