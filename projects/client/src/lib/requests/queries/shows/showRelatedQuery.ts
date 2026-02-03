import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { z } from 'zod';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowRelatedParams =
  & {
    slug: string;
  }
  & PaginationParams
  & ApiParams;

const RelatedShowSchema = ShowEntrySchema;
export type RelatedShow = z.infer<typeof RelatedShowSchema>;

const showRelatedRequest = (
  { fetch, slug, limit, page }: ShowRelatedParams,
) =>
  api({ fetch })
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

export const showRelatedQuery = defineInfiniteQuery({
  key: 'showRelated',
  invalidations: [],
  dependencies: (params) => [params.slug, params.page, params.limit],
  request: showRelatedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToShowEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(RelatedShowSchema),
  ttl: time.days(1),
});
