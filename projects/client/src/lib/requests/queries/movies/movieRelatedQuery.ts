import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { type MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieRelatedParams = {
  slug: string;
} & ApiParams;

function movieRelatedRequest(
  { fetch, slug }: MovieRelatedParams,
): Promise<MovieSummary[]> {
  return api({ fetch })
    .movies
    .related({
      query: {
        extended: 'full,cloud9',
      },
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch related movies');
      }

      return body.map(mapMovieResponseToMovieSummary);
    });
}

const movieRelatedQueryKey = ['movieRelated'] as const;
export const movieRelatedQuery = (
  params: MovieRelatedParams,
) => ({
  queryKey: movieRelatedQueryKey,
  queryFn: () => movieRelatedRequest(params),
});
