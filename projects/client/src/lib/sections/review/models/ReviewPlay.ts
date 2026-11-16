import type { ReviewTitle } from './ReviewTitle.ts';

export type ReviewPlay = {
  title: ReviewTitle;
  watchedAt: Date;
  episode?: {
    season: number;
    number: number;
    title: string;
  };
};
