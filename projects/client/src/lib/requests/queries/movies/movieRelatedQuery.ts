import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MovieRelatedParams =
  & {
    slug: string;
    isSmart?: boolean;
  }
  & PaginationParams
  & ApiParams;

const movieRelatedRequest = async (
  { fetch, slug, limit, page, isSmart }: MovieRelatedParams,
) => {
  if (isSmart) {
    const response = await rawApiFetch({
      fetch,
      path:
        `/movies/${slug}/related/nn?extended=full,images,colors&limit=${limit}&page=${page}`,
    });
    return response.ok
      ? {
        body: await response.json(),
        headers: response.headers,
        status: 200,
      }
      : { body: [], headers: response.headers, status: 200 };
  }

  return api({ fetch })
    .movies
    .related({
      query: {
        extended: 'full,images,colors',
        limit,
        page,
      },
      params: {
        id: slug,
      },
    });
};

export const movieRelatedQuery = defineInfiniteQuery({
  key: 'movieRelated',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.slug, params.page, params.limit, params.isSmart],
  request: movieRelatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMovieEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MovieEntrySchema),
  ttl: time.hours(12),
});
