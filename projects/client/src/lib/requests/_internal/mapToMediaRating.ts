import type { MovieRatingsResponse, ShowRatingsResponse } from '$lib/api.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { MediaRating } from '../models/MediaRating.ts';

type RatingResponse = MovieRatingsResponse | ShowRatingsResponse;

// FIXME: remove when server always returns https
function forceHttps(url: string | Nil): HttpsUrl | Nil {
  const strippedUrl = url?.replace(/^(http:\/\/)/, '');
  return prependHttps(strippedUrl);
}

export function mapToMediaRating(
  ratings: RatingResponse,
): MediaRating {
  return {
    trakt: {
      rating: ratings.trakt.rating / 10,
      votes: ratings.trakt.votes,
      distribution: ratings.trakt.distribution,
    },
    rotten: {
      critic: ratings.rotten_tomatoes?.rating ?? 0,
      audience: ratings.rotten_tomatoes?.user_rating ?? 0,
      url: forceHttps(ratings.rotten_tomatoes?.link),
    },
    imdb: {
      rating: ratings.imdb?.rating ?? 0,
      votes: ratings.imdb?.votes ?? 0,
      url: forceHttps(ratings.imdb?.link),
    },
  };
}
