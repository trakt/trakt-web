import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { toMonthReviewFromWatched } from '$lib/sections/month-in-review/toMonthReviewFromWatched.ts';
import type { MonthInReviewPoster } from './MonthInReviewPoster.ts';

const POSTER_COUNT = 3;

type ToMonthInReviewPostersParams = {
  history: UserHistory;
  month: Date;
};

export function toMonthInReviewPosters({
  history,
  month,
}: ToMonthInReviewPostersParams): MonthInReviewPoster[] {
  const { titles } = toMonthReviewFromWatched({
    history,
    year: month.getFullYear(),
    month: month.getMonth() + 1,
  });

  return titles
    .toSorted((a, b) => b.plays - a.plays)
    .slice(0, POSTER_COUNT)
    .map(({ key, poster }) => ({ key, src: poster }));
}
