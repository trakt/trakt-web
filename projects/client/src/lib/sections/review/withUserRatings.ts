import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { Review } from './models/Review.ts';
import type { ReviewTitle } from './models/ReviewTitle.ts';

type WithUserRatingsParams = {
  review: Review;
  ratings: UserRatings;
};

function withRating(title: ReviewTitle, ratings: UserRatings): ReviewTitle {
  const lookup = title.type === 'movie' ? ratings.movies : ratings.shows;
  const rating = lookup.get(title.id)?.rating;

  return rating === undefined ? title : { ...title, rating };
}

export function withUserRatings({
  review,
  ratings,
}: WithUserRatingsParams): Review {
  const titles = review.titles.map((title) => withRating(title, ratings));

  return {
    ...review,
    titles,
    unrated: titles.filter((title) => title.rating === undefined),
  };
}
