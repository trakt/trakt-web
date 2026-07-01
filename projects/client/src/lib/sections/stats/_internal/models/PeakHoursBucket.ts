type TimeOfDayKey = 'morning' | 'afternoon' | 'evening' | 'night';

export type PeakHoursBucket = {
  readonly label: string;
  readonly count: number;
  readonly movies: number;
  readonly episodes: number;
  readonly key: TimeOfDayKey;
};
