import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import {
  mapMovieResponseToMovieSummary,
} from '../../_internal/mapMovieResponseToMovieSummary.ts';

type MovieSummaryParams = { slug: string } & ApiParams;

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
        throw new Error('Failed to fetch movie summary');
      }

      return mapMovieResponseToMovieSummary(body);
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
