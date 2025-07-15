import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type CollaborationListsParams = { slug: string } & ApiParams;

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

export const collaborationListsQuery = defineQuery({
  key: 'collaborationLists',
  invalidations: [
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: (params) => [params.slug],
  request: collaborationListsRequest,
  mapper: (response) => response.body.map(mapToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
