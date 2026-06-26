import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowRelatedParams =
  & {
    slug: string;
    isSmart?: boolean;
  }
  & PaginationParams
  & ApiParams;

const RelatedShowSchema = ShowEntrySchema;
export type RelatedShow = z.infer<typeof RelatedShowSchema>;

const showRelatedRequest = async (
  { fetch, slug, limit, page, isSmart }: ShowRelatedParams,
) => {
  if (isSmart) {
    const response = await rawApiFetch({
      fetch,
      path:
        `/shows/${slug}/related/nn?extended=full,images,colors&limit=${limit}&page=${page}`,
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
    .shows
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

export const showRelatedQuery = defineInfiniteQuery({
  key: 'showRelated',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.slug, params.page, params.limit, params.isSmart],
  request: showRelatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToShowEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(RelatedShowSchema),
  ttl: time.hours(12),
});
