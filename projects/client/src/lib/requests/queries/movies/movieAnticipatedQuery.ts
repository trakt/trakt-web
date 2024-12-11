import type { MovieAnticipatedResponse } from '$lib/api.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import {
  mapMovieResponseToMovieSummary,
} from '../../_internal/mapMovieResponseToMovieSummary.ts';

export type AnticipatedMovie = MovieSummary & {
  score: number;
};

type MovieAnticipatedParams = {
  page?: number;
  limit?: number;
} & ApiParams;

export function mapResponseToAnticipatedMovie(
  movies: MovieAnticipatedResponse,
): AnticipatedMovie[] {
  return movies.map(({ movie, list_count }) => ({
    score: list_count,
    ...mapMovieResponseToMovieSummary(movie),
  }));
}

function movieAnticipatedRequest(
  { fetch, limit, page = 1 }: MovieAnticipatedParams,
): Promise<AnticipatedMovie[]> {
  return api({ fetch })
    .movies
    .anticipated({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch anticipated movies');
      }

      return mapResponseToAnticipatedMovie(body);
    });
}

const movieAnticipatedQueryKey = ['movieAnticipated'] as const;
export const movieAnticipatedQuery = (
  params: MovieAnticipatedParams = {},
) => ({
  queryKey: movieAnticipatedQueryKey,
  queryFn: () => movieAnticipatedRequest(params),
});
