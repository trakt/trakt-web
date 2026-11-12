import type { MonthReviewTitle } from './MonthReviewTitle.ts';

export type MonthReviewPlay = {
  title: MonthReviewTitle;
  watchedAt: Date;
  episode?: {
    season: number;
    number: number;
    title: string;
  };
};
