export type WeekData = {
  readonly movieDates: readonly Date[];
  readonly showDates: readonly Date[];
  readonly uniqueShows: number;
  readonly ratings: ReadonlyArray<{ readonly rating: number }>;
  readonly totalMinutes: number;
  readonly dailyMinutes: ReadonlyArray<number>;
};
