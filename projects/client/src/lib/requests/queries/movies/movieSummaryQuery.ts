import type { Genre, MovieResponse } from '$lib/api.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

export type MovieSummary = {
  id: number;
  slug: string;
  runtime: number;
  title: string;
  tagline: string;
  poster: {
    url: string;
  };
  cover: {
    url: string;
  };
  genres: Genre[];
  overview: string;
  trailer?: string;
};

type MovieSummaryParams = { slug: string } & ApiParams;

export function mapResponseToMovieSummary(movie: MovieResponse): MovieSummary {
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

function movieSummaryRequest(
  { fetch, slug }: MovieSummaryParams,
): Promise<MovieSummary> {
  return api({ fetch })
    .movies
    .summary({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return mapResponseToMovieSummary(body);
    });
}

export const movieSummaryQueryKey = (id: string) =>
  ['movieSummary', id] as const;
export const movieSummaryQuery = (
  params: MovieSummaryParams,
) => ({
  queryKey: movieSummaryQueryKey(params.slug),
  queryFn: () => movieSummaryRequest(params),
});
