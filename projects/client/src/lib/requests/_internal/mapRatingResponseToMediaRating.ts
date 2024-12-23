import type { MovieRatingsResponse, ShowRatingsResponse } from '$lib/api.ts';
import type { MediaRating } from '$lib/models/MediaRating.ts';

type RatingResponse = MovieRatingsResponse | ShowRatingsResponse;

export function mapRatingResponseToMediaRating(
  ratings: RatingResponse,
): MediaRating {
  return {
    trakt: {
      rating: ratings.trakt.rating / 10,
      votes: ratings.trakt.votes,
      distribution: ratings.trakt.distribution,
    },
    tmdb: {
      rating: (ratings.tmdb?.rating ?? 0) / 10,
      votes: ratings.tmdb?.votes ?? 0,
    },
    rotten: {
      critic: ratings.rotten_tomatoes?.rating ?? 0,
      audience: ratings.rotten_tomatoes?.user_rating ?? 0,
    },
    imdb: {
      rating: ratings.imdb?.rating ?? 0,
      votes: ratings.imdb?.votes ?? 0,
    },
    metacritic: ratings.metascore?.rating ?? 0,
  };
}
