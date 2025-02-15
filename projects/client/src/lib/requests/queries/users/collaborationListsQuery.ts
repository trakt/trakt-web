import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type CollaborationListsParams = ApiParams;

const collaborationListsRequest = (
  { fetch }: CollaborationListsParams,
) =>
  api({ fetch })
    .users
    .lists
    .collaborations({
      params: {
        id: 'me',
      },
      query: {
        extended: 'images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch user collaboration lists');
      }

      return response.body;
    });

export const collaborationListsQuery = defineQuery({
  key: 'collaborationLists',
  invalidations: [],
  dependencies: [],
  request: collaborationListsRequest,
  mapper: (data) => data.map(mapToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
