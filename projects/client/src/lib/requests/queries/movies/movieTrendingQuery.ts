import type { MovieTrendingResponse } from '$lib/api.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import {
  mapMovieResponseToMovieSummary,
} from '../../_internal/mapMovieResponseToMovieSummary.ts';

export type TrendingMovie = MovieSummary & {
  watchers: number;
};

type MovieTrendingParams = {
  page?: number;
  limit?: number;
} & ApiParams;

export function mapResponseToTrendingMovies({
  watchers,
  movie,
}: MovieTrendingResponse): TrendingMovie {
  return {
    watchers,
    ...mapMovieResponseToMovieSummary(movie),
  };
}

function movieTrendingRequest(
  { fetch, page = 1, limit = DEFAULT_PAGE_SIZE }: MovieTrendingParams,
): Promise<Paginatable<TrendingMovie>> {
  return api({ fetch })
    .movies
    .trending({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch trending movies');
      }

      return {
        entries: body.map(mapResponseToTrendingMovies),
        page: extractPageMeta(headers),
      };
    });
}

const movieTrendingQueryKey = (params: MovieTrendingParams) =>
  ['movieTrending', params.limit, params.page] as const;
export const movieTrendingQuery = (
  params: MovieTrendingParams = {},
) => ({
  queryKey: movieTrendingQueryKey(params),
  queryFn: () => movieTrendingRequest(params),
});
