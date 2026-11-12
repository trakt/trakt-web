import type { MonthReviewShare } from './MonthReviewShare.ts';
import type { MonthReviewTitle } from './MonthReviewTitle.ts';

export type MonthReviewTypeStats = {
  plays: number;
  minutes: number;
  items: number;
  playsPerDay: number;
  minutesPerDay: number;
  titles: ReadonlyArray<MonthReviewTitle>;
  genres: ReadonlyArray<MonthReviewShare>;
  genreCount: number;
  dailyPlays?: ReadonlyArray<number>;
  hourlyPlays?: ReadonlyArray<number>;
};
