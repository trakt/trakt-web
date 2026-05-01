import { MAX_DATE } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { MovieCertificationResponse, MovieResponse } from '@trakt/api';
import type { MovieEntry } from '../models/MovieEntry.ts';
import { mapToColors } from './mapToColors.ts';
import { mapToCover } from './mapToCover.ts';
import { mapToLogo } from './mapToLogo.ts';
import { mapToPostCredits } from './mapToPostCredits.ts';
import { mapToPoster } from './mapToPoster.ts';
import { mapToSocialMedia } from './mapToSocialMedia.ts';
import { mapToTraktRating } from './mapToTraktRating.ts';

function mapMovieCertificationResponse(
  certification: MovieCertificationResponse | Nil,
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
  const logo = mapToLogo(movie.images);

  const thumbCandidate = findDefined(
    ...(movie.images?.thumb ?? []),
  );

  const effectiveReleaseDate = new Date(movie.released ?? MAX_DATE);

  return {
    id: movie.ids.trakt,
    imdbId: movie.ids.imdb,
    tmdbId: movie.ids.tmdb,
    key: `movie-${movie.ids.trakt}`,
    slug: movie.ids.slug,
    type: 'movie',
    title: movie.title,
    originalTitle: movie.original_title,
    runtime: movie.runtime ?? NaN,
    year: movie.year,
    tagline: movie.tagline ?? '',
    country: movie.country,
    languages: movie.languages,
    colors: mapToColors(movie.colors?.poster),
    poster,
    cover,
    logo,
    thumb: {
      url: prependHttps(
        findDefined(
          thumbCandidate,
        ),
        cover.url.thumb,
      ),
    },
    genres: movie.genres ?? [],
    status: movie.status ?? 'unknown',
    overview: movie.overview ?? 'TBD',
    trailer: prependHttps(
      movie.trailer,
    ),
    /**
     * Duplicate for compat with other entities.
     */
    airDate: effectiveReleaseDate,
    releaseDate: effectiveReleaseDate,
    effectiveReleaseDate,
    certification: mapMovieCertificationResponse(movie.certification),
    votes: movie.votes ?? 0,
    plexSlug: movie.ids.plex?.slug,
    postCredits: mapToPostCredits(movie),
    rating: mapToTraktRating(movie.rating),
    homepage: prependHttps(movie.homepage),
    socialMedia: mapToSocialMedia(movie),
  };
}
