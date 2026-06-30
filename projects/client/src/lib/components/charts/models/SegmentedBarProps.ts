export type SegmentedBarItem = {
  /** Primary label (e.g. "Fantasy"). */
  label: string;
  /** Magnitude; segment width is its share of the total. */
  value: number;
  /** Optional secondary line (e.g. "15 shows"). */
  sublabel?: string;
  /** Palette slot override; defaults to the item's position. */
  seriesIndex?: number;
};

export type SegmentedBarProps = {
  items: SegmentedBarItem[];
  /** Accessible summary; rendered as a screen-reader figcaption. */
  label?: string;
  /**
   * Minimum segment width as a fraction so small-but-nonzero categories stay
   * visible + labelable. Defaults to 0.04.
   */
  minSegment?: number;
  /**
   * Cap on rendered segments (including the rolled-up "Other" bucket). When
   * `items` exceeds this, the smallest-by-value categories collapse into a
   * single trailing "Other" segment so the bar never degrades into unreadable
   * slivers. Defaults to 8.
   */
  maxSegments?: number;
};
