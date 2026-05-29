export type Yir2024StatEntry = {
  name: string;
  count: number;
};

export type Yir2024StatSummaryProps = {
  /** Top-ranked entry (rendered first). */
  mostWatched: Yir2024StatEntry | undefined;
  /**
   * Bottom-ranked entry. Pass `undefined` when it would duplicate
   * `mostWatched` (e.g. a single-item list) so the row is omitted.
   */
  leastWatched: Yir2024StatEntry | undefined;
  /** Label for the total-count row, e.g. "Genre Count" / "Network Count". */
  countLabel: string;
  /** Total number of distinct entries. */
  total: number;
  /** Resolves the singular/plural unit for a given count, e.g. "13 shows". */
  unit: (count: number) => string;
};
