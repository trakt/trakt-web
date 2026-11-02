import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { MonthReviewParams } from './MonthReviewParams.ts';
import type { MonthReviewSource } from './MonthReviewSource.ts';
import { toMonthReviewFromWatched } from '$lib/sections/month-in-review/toMonthReviewFromWatched.ts';
import { withRatingsOverlay } from './withRatingsOverlay.ts';

export function useFreeMonthReview(
  params: Observable<MonthReviewParams>,
): MonthReviewSource {
  const { history, ratings } = useUser();

  const review = combineLatest([params, history]).pipe(
    map(([$params, $history]) =>
      $params.isEnabled && $history
        ? toMonthReviewFromWatched({
            history: $history,
            year: $params.year,
            month: $params.month,
          })
        : null,
    ),
  );

  return {
    review: withRatingsOverlay({ review, ratings, params }),
    isLoading: combineLatest([params, history]).pipe(
      map(([$params, $history]) => $params.isEnabled && $history === null),
    ),
  };
}
