import type { Review } from '$lib/sections/review/models/Review.ts';
import type { toFreeYearStats } from './toFreeYearStats.ts';

export type FreeYearReview = {
  watched: Review;
  stats: ReturnType<typeof toFreeYearStats>;
};
