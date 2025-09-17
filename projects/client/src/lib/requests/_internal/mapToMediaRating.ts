import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { RatingsResponse } from '@trakt/api';
import type { MediaRating } from '../models/MediaRating.ts';

export function mapToMediaRating(
  ratings: RatingsResponse,
): MediaRating {
  const mapImdbRating = () => {
    const { imdb } = ratings;
    if (!imdb?.rating || !imdb?.votes) {
      return;
    }

    return {
      rating: imdb.rating,
      votes: imdb.votes,
      url: prependHttps(imdb.link),
    };
  };

  const mapRottenRating = () => {
    const { rotten_tomatoes: rotten } = ratings;
    if (!rotten?.rating) {
      return;
    }

    return {
      critic: rotten.rating / 100,
      audience: rotten.user_rating && rotten.user_rating / 100,
      url: prependHttps(rotten.link),
    };
  };

  return {
    trakt: {
      rating: ratings.trakt.rating / 10,
      votes: ratings.trakt.votes,
      distribution: ratings.trakt.distribution,
    },
    imdb: mapImdbRating(),
    rotten: mapRottenRating(),
  };
}
