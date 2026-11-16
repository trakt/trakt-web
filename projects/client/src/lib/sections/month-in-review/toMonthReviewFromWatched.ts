import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { toMonthRange } from './_internal/data/toMonthRange.ts';
import type { Review } from '$lib/sections/review/models/Review.ts';
import { toReviewFromWatched } from '$lib/sections/review/toReviewFromWatched.ts';

type ToMonthReviewFromWatchedParams = {
  history: UserHistory;
  year: number;
  month: number;
};

export function toMonthReviewFromWatched({
  history,
  year,
  month,
}: ToMonthReviewFromWatchedParams): Review {
  return toReviewFromWatched({ history, ...toMonthRange({ year, month }) });
}
