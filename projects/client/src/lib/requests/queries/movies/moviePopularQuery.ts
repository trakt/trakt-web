import type { Paginatable } from '$lib/models/Paginatable.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { type MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MoviePopularParams = {
  page?: number;
  limit?: number;
} & ApiParams;

function moviePopularRequest(
  { fetch, limit = DEFAULT_PAGE_SIZE, page = 1 }: MoviePopularParams,
): Promise<Paginatable<MovieSummary>> {
  return api({ fetch })
    .movies
    .popular({
      query: {
        extended: 'full,cloud9',
        limit,
        page,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch popular movies');
      }

      return {
        entries: body.map(mapMovieResponseToMovieSummary),
        page: extractPageMeta(headers),
      };
    });
}

const moviePopularQueryKey = (params: MoviePopularParams) =>
  ['moviePopular', params.limit, params.page] as const;
export const moviePopularQuery = (
  params: MoviePopularParams = {},
) => ({
  queryKey: moviePopularQueryKey(params),
  queryFn: () => moviePopularRequest(params),
});
