import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { MonthReview } from '../models/MonthReview.ts';
import type { MonthReviewParams } from './MonthReviewParams.ts';
import { withUserRatings } from './withUserRatings.ts';

type WithRatingsOverlayParams = {
  review: Observable<MonthReview | null>;
  ratings: Observable<UserRatings | Nil>;
  params: Observable<MonthReviewParams>;
};

export function withRatingsOverlay({
  review,
  ratings,
  params,
}: WithRatingsOverlayParams): Observable<MonthReview | null> {
  return combineLatest([review, ratings, params]).pipe(
    map(([$review, $ratings, $params]) =>
      $review && $ratings && $params.withRatings
        ? withUserRatings({ review: $review, ratings: $ratings })
        : $review,
    ),
  );
}
