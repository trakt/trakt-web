import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';

type CollaborationListsParams = { slug: string } & ApiParams;

// FIXME: add pagination support to this endpoint
const collaborationListsRequest = (
  { fetch, slug }: CollaborationListsParams,
) =>
  api({ fetch })
    .users
    .lists
    .collaborations({
      params: {
        id: slug,
      },
      query: {
        extended: 'images',
      },
    });

export const collaborationListsQuery = defineInfiniteQuery({
  key: 'collaborationLists',
  invalidations: [
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
    InvalidateAction.List.Like,
  ],
  dependencies: (params) => [params.slug],
  request: collaborationListsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaListSummary),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaListSummarySchema),
  ttl: time.minutes(30),
});
