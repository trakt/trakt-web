export type PulseGraphData = {
  readonly dailyBars: {
    readonly days: readonly number[];
    readonly labels: readonly string[];
  };
  readonly weekTrend: {
    readonly weeks: ReadonlyArray<
      { readonly label: string; readonly plays: number }
    >;
  };
  readonly watchClock: {
    readonly buckets: ReadonlyArray<
      { readonly label: string; readonly count: number }
    >;
  };
  readonly showsMovies: {
    readonly episodes: number;
    readonly movies: number;
  };
  readonly ratingsDistribution: {
    readonly buckets: readonly number[];
    readonly average: number;
  };
  readonly screenTimeDaily: {
    readonly percentages: readonly number[];
    readonly minutesPerDay: readonly number[];
    readonly labels: readonly string[];
  };
};
