import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { RatingsResponse } from '@trakt/api';
import type { MediaRating } from '../models/MediaRating.ts';
import { mapToTraktRating } from './mapToTraktRating.ts';

// The movie/show ratings endpoints return extra source blocks under
// `extended=all` (Letterboxd for films, MyAnimeList for anime). The SDK infers
// these per-endpoint but does not export dedicated types, so widen the shared
// `RatingsResponse` with the optional blocks this mapper knows how to read.
type ExternalRatingBlock = {
  rating?: number | Nil;
  votes?: number | Nil;
  link?: string | Nil;
};

type RatingsResponseWithExternal = RatingsResponse & {
  letterboxd?: ExternalRatingBlock | Nil;
  mal?: ExternalRatingBlock | Nil;
};

export function mapToMediaRating(
  ratings: RatingsResponseWithExternal,
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

  // TMDB, MAL and Letterboxd share one 0-10 shape: a rating, optional votes and
  // a link. Map them through a single helper keyed on the source block.
  const mapExternalRating = (block: ExternalRatingBlock | Nil) => {
    if (block?.rating == null) {
      return;
    }

    return {
      rating: block.rating,
      votes: block.votes,
      url: prependHttps(block.link),
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
      rating: mapToTraktRating(ratings.trakt.rating),
      votes: ratings.trakt.votes,
      distribution: ratings.trakt.distribution,
    },
    imdb: mapImdbRating(),
    tmdb: mapExternalRating(ratings.tmdb),
    rotten: mapRottenRating(),
    mal: mapExternalRating(ratings.mal),
    letterboxd: mapExternalRating(ratings.letterboxd),
  };
}
