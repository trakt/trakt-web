import type { ReviewPlay } from './ReviewPlay.ts';
import type { ReviewShare } from './ReviewShare.ts';
import type { ReviewTitle } from './ReviewTitle.ts';
import type { ReviewTypeStats } from './ReviewTypeStats.ts';

export type Review = {
  tier: 'free' | 'vip';
  plays: number;
  episodes: number;
  movies: number;
  shows: number;
  activeDays?: number;
  titles: ReadonlyArray<ReviewTitle>;
  unrated?: ReadonlyArray<ReviewTitle>;
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
  services?: ReadonlyArray<ReviewShare>;
  genres?: ReadonlyArray<ReviewShare>;
  ratingsCount?: number;
  commentsCount?: number;
  listsCount?: number;
  playsPerDay?: number;
  minutesPerDay?: number;
  byType?: {
    shows: ReviewTypeStats;
    movies: ReviewTypeStats;
  };
  topRated?: ReadonlyArray<ReviewTitle>;
  firstPlay?: ReviewPlay;
  lastPlay?: ReviewPlay;
};
