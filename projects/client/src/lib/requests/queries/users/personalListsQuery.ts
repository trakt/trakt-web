import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type PersonalListsParams = { slug: string } & ApiParams & PaginationParams;

const personalListsRequest = (
  { fetch, slug, page, limit }: PersonalListsParams,
) =>
  api({ fetch })
    .users
    .lists
    .personal({
      params: {
        id: slug,
      },
      query: {
        extended: 'images',
        page,
        limit,
      },
    });

export const personalListsQuery = defineQuery({
  key: 'personalLists',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.List.Deleted,
    InvalidateAction.List.Created,
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: (params) => [params.slug, params.page, params.limit],
  request: personalListsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaListSummary),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaListSummarySchema),
  ttl: time.minutes(30),
});
