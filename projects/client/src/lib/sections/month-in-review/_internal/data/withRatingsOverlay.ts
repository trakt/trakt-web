import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { Review } from '$lib/sections/review/models/Review.ts';
import type { MonthReviewParams } from './MonthReviewParams.ts';
import { withUserRatings } from '$lib/sections/review/withUserRatings.ts';

type WithRatingsOverlayParams = {
  review: Observable<Review | null>;
  ratings: Observable<UserRatings | Nil>;
  params: Observable<MonthReviewParams>;
};

export function withRatingsOverlay({
  review,
  ratings,
  params,
}: WithRatingsOverlayParams): Observable<Review | null> {
  return combineLatest([review, ratings, params]).pipe(
    map(([$review, $ratings, $params]) =>
      $review && $ratings && $params.withRatings
        ? withUserRatings({ review: $review, ratings: $ratings })
        : $review,
    ),
  );
}
