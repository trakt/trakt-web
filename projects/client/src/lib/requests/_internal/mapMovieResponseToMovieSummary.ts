import type { MovieCertificationResponse, MovieResponse } from '$lib/api.ts';
import { mediumUrl } from '$lib/requests/_internal/mediumUrl.ts';
import { thumbUrl } from '$lib/requests/_internal/thumbUrl.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import {
  DEFAULT_TRAILER,
  MAX_DATE,
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
  MEDIA_POSTER_PLACEHOLDER,
} from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

function mapMovieCertificationResponse(
  certification?: MovieCertificationResponse,
) {
  const hasValidCertification = certification && certification !== 'undefined';
  if (!hasValidCertification) {
    return undefined;
  }

  return certification;
}

export function mapMovieResponseToMovieSummary(
  movie: MovieResponse,
): MovieSummary {
  const posterCandidate = findDefined(
    movie.images?.poster.at(1),
    movie.images?.poster.at(0),
  );

  const coverCandidate = findDefined(
    movie.images?.fanart.at(1),
    movie.images?.fanart.at(0),
  );

  return {
    id: movie.ids.trakt,
    slug: movie.ids.slug,
    title: movie.title,
    runtime: movie.runtime ?? NaN,
    year: movie.year,
    tagline: movie.tagline ?? '',
    country: movie.country,
    languages: movie.languages,
    poster: {
      url: {
        medium: prependHttps(
          mediumUrl(posterCandidate),
          MEDIA_POSTER_PLACEHOLDER,
        ),
        thumb: prependHttps(
          thumbUrl(posterCandidate),
          MEDIA_POSTER_PLACEHOLDER,
        ),
      },
    },
    cover: {
      url: {
        medium: prependHttps(
          mediumUrl(coverCandidate),
          MEDIA_COVER_LARGE_PLACEHOLDER,
        ),
        thumb: prependHttps(
          thumbUrl(coverCandidate),
          MEDIA_COVER_THUMB_PLACEHOLDER,
        ),
      },
    },
    thumb: {
      url: prependHttps(
        thumbUrl(coverCandidate),
        MEDIA_COVER_THUMB_PLACEHOLDER,
      ),
    },
    genres: movie.genres ?? [],
    status: movie.status ?? 'unknown',
    overview: movie.overview ?? 'TBD',
    trailer: prependHttps(
      movie.trailer,
      DEFAULT_TRAILER,
    ),
    airedDate: new Date(movie.released ?? MAX_DATE),
    certification: mapMovieCertificationResponse(movie.certification),
  };
}
