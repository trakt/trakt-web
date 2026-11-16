import type { ReviewShare } from './ReviewShare.ts';
import type { ReviewTitle } from './ReviewTitle.ts';

export type ReviewTypeStats = {
  plays: number;
  minutes: number;
  items: number;
  playsPerDay: number;
  minutesPerDay: number;
  titles: ReadonlyArray<ReviewTitle>;
  genres: ReadonlyArray<ReviewShare>;
  genreCount: number;
  dailyPlays?: ReadonlyArray<number>;
  hourlyPlays?: ReadonlyArray<number>;
};
