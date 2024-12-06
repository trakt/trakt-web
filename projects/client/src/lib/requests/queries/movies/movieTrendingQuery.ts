import type { MovieTrendingResponse } from '$lib/api.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import {
  mapMovieResponseToMovieSummary,
} from '../../_internal/mapMovieResponseToMovieSummary.ts';

export type TrendingMovie = MovieSummary & {
  watchers: number;
};

type MovieTrendingParams = ApiParams;

export function mapResponseToTrendingMovies(
  movies: MovieTrendingResponse,
): TrendingMovie[] {
  return movies.map(({ movie, watchers }) => ({
    watchers: watchers,
    ...mapMovieResponseToMovieSummary(movie),
  }));
}

function movieTrendingRequest(
  { fetch }: MovieTrendingParams,
): Promise<TrendingMovie[]> {
  return api({ fetch })
    .movies
    .trending({
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch trending movies');
      }

      return mapResponseToTrendingMovies(body);
    });
}

const movieTrendingQueryKey = ['movieTrending'] as const;
export const movieTrendingQuery = (
  params: MovieTrendingParams = {},
) => ({
  queryKey: movieTrendingQueryKey,
  queryFn: () => movieTrendingRequest(params),
});
