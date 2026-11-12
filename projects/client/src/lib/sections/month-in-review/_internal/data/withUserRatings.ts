import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { MonthReview } from '../models/MonthReview.ts';
import type { MonthReviewTitle } from '../models/MonthReviewTitle.ts';

type WithUserRatingsParams = {
  review: MonthReview;
  ratings: UserRatings;
};

function withRating(
  title: MonthReviewTitle,
  ratings: UserRatings,
): MonthReviewTitle {
  const lookup = title.type === 'movie' ? ratings.movies : ratings.shows;
  const rating = lookup.get(title.id)?.rating;

  return rating === undefined ? title : { ...title, rating };
}

export function withUserRatings({
  review,
  ratings,
}: WithUserRatingsParams): MonthReview {
  const titles = review.titles.map((title) => withRating(title, ratings));

  return {
    ...review,
    titles,
    unrated: titles.filter((title) => title.rating === undefined),
  };
}
