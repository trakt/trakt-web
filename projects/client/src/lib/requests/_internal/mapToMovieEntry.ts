import type { MovieCertificationResponse, MovieResponse } from '$lib/api.ts';
import { DEFAULT_TRAILER, MAX_DATE } from '$lib/utils/constants.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { MovieEntry } from '../models/MovieEntry.ts';
import { mapToCover } from './mapToCover.ts';
import { mapToPoster } from './mapToPoster.ts';

function mapMovieCertificationResponse(
  certification?: MovieCertificationResponse,
) {
  const hasValidCertification = certification && certification !== 'undefined';
  if (!hasValidCertification) {
    return undefined;
  }

  return certification;
}

export function mapToMovieEntry(
  movie: MovieResponse,
): MovieEntry {
  const poster = mapToPoster(movie.images);
  const cover = mapToCover(movie.images);

  return {
    id: movie.ids.trakt,
    slug: movie.ids.slug,
    type: 'movie',
    title: movie.title,
    runtime: movie.runtime ?? NaN,
    year: movie.year,
    tagline: movie.tagline ?? '',
    country: movie.country,
    languages: movie.languages,
    poster,
    cover,
    thumb: {
      url: cover.url.thumb,
    },
    genres: movie.genres ?? [],
    status: movie.status ?? 'unknown',
    overview: movie.overview ?? 'TBD',
    trailer: prependHttps(
      movie.trailer,
      DEFAULT_TRAILER,
    ),
    airDate: new Date(movie.released ?? MAX_DATE),
    certification: mapMovieCertificationResponse(movie.certification),
  };
}
