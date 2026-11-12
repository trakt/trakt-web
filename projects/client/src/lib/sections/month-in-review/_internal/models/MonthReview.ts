import type { MonthReviewPlay } from './MonthReviewPlay.ts';
import type { MonthReviewShare } from './MonthReviewShare.ts';
import type { MonthReviewTitle } from './MonthReviewTitle.ts';
import type { MonthReviewTypeStats } from './MonthReviewTypeStats.ts';

export type MonthReview = {
  tier: 'free' | 'vip';
  plays: number;
  episodes: number;
  movies: number;
  shows: number;
  activeDays?: number;
  titles: ReadonlyArray<MonthReviewTitle>;
  unrated?: ReadonlyArray<MonthReviewTitle>;
  minutes?: number;
  previous?: {
    plays: number;
    minutes: number;
    minutesPerDay: number;
    activeDays?: number;
  };
  weekdayPlays?: ReadonlyArray<number>;
  dailyPlays?: ReadonlyArray<number>;
  hourlyPlays?: ReadonlyArray<number>;
  services?: ReadonlyArray<MonthReviewShare>;
  genres?: ReadonlyArray<MonthReviewShare>;
  ratingsCount?: number;
  commentsCount?: number;
  listsCount?: number;
  playsPerDay?: number;
  minutesPerDay?: number;
  byType?: {
    shows: MonthReviewTypeStats;
    movies: MonthReviewTypeStats;
  };
  topRated?: ReadonlyArray<MonthReviewTitle>;
  firstPlay?: MonthReviewPlay;
  lastPlay?: MonthReviewPlay;
};
