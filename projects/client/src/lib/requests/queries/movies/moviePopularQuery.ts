import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { type MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MoviePopularParams = {
  page?: number;
  limit?: number;
} & ApiParams;

function moviePopularRequest(
  { fetch, page = 1, limit = 10 }: MoviePopularParams,
): Promise<MovieSummary[]> {
  return api({ fetch })
    .movies
    .popular({
      query: {
        extended: 'full,cloud9',
        limit,
        page,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch popular movies');
      }

      return body.map(mapMovieResponseToMovieSummary);
    });
}

const moviePopularQueryKey = ['moviePopular'] as const;
export const moviePopularQuery = (
  params: MoviePopularParams = {},
) => ({
  queryKey: moviePopularQueryKey,
  queryFn: () => moviePopularRequest(params),
});
