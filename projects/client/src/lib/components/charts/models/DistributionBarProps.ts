export type DistributionBarProps = {
  /** Fill level, 0..1. Values outside the range are clamped. */
  fraction: number;
  /** Fill axis. `horizontal` grows left-to-right, `vertical` bottom-to-top. */
  orientation?: 'horizontal' | 'vertical';
  /** Zero-based palette slot driving color + hatch pattern via `--viz-*`. */
  seriesIndex?: number;
  /** Explicit CSS color override; defaults to the `seriesIndex` viz token. */
  color?: string;
  /** Spotlight this bar (full strength + glow) - e.g. hovered/selected row. */
  active?: boolean;
  /** Render the muted track behind the fill. Defaults to true. */
  track?: boolean;
  /** Round the fill + track ends. Defaults to true. */
  rounded?: boolean;
  /**
   * Minimum visible fill as a fraction, so a non-zero value never collapses to
   * an invisible sliver. Defaults to 0 (no floor).
   */
  minVisible?: number;
  /** Stagger index for the entrance animation (later bars animate later). */
  index?: number;
  /** Accessible label for the progressbar role. */
  label?: string;
};
