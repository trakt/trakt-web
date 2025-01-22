import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { z } from 'zod';
import { mapMovieResponseToMovieSummary } from '../../_internal/mapMovieResponseToMovieSummary.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MovieRelatedParams = {
  slug: string;
} & ApiParams;

const movieRelatedRequest = (
  { fetch, slug }: MovieRelatedParams,
) =>
  api({ fetch })
    .movies
    .related({
      query: {
        extended: 'full,cloud9',
      },
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch related movies');
      }

      return response.body;
    });

export const movieRelatedQuery = defineQuery({
  key: 'movieRelated',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieRelatedRequest,
  mapper: (response) => response.map(mapMovieResponseToMovieSummary),
  schema: z.array(MovieEntrySchema),
});
