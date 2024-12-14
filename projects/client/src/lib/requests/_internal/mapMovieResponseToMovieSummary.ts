import { type MovieResponse } from '$lib/api.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function mapMovieResponseToMovieSummary(
  movie: MovieResponse,
): MovieSummary {
  return {
    id: movie.ids.trakt,
    slug: movie.ids.slug,
    title: movie.title,
    runtime: movie.runtime!,
    tagline: movie.tagline ?? '',
    poster: {
      url: prependHttps(
        findDefined(
          movie.images?.poster.at(1),
          movie.images?.poster.at(0),
        ),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    cover: {
      url: prependHttps(
        findDefined(
          movie.images?.fanart.at(1),
          movie.images?.fanart.at(0),
        ),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    genres: movie.genres ?? [],
    overview: movie.overview ?? 'TBD',
    trailer: movie.trailer,
  };
}
