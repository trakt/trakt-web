import type { MovieAnticipatedResponse } from '$lib/api.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
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

export function mapResponseToAnticipatedMovie({
  list_count,
  movie,
}: MovieAnticipatedResponse): AnticipatedMovie {
  return {
    score: list_count,
    ...mapMovieResponseToMovieSummary(movie),
  };
}

function movieAnticipatedRequest(
  { fetch, limit = DEFAULT_PAGE_SIZE, page = 1 }: MovieAnticipatedParams,
): Promise<Paginatable<AnticipatedMovie>> {
  return api({ fetch })
    .movies
    .anticipated({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch anticipated movies');
      }

      return {
        entries: body.map(mapResponseToAnticipatedMovie),
        page: extractPageMeta(headers),
      };
    });
}

const movieAnticipatedQueryKey = (params: MovieAnticipatedParams) =>
  ['movieAnticipated', params.limit, params.page] as const;
export const movieAnticipatedQuery = (
  params: MovieAnticipatedParams = {},
) => ({
  queryKey: movieAnticipatedQueryKey(params),
  queryFn: () => movieAnticipatedRequest(params),
});
