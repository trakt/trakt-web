import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type ListSummaryParams = { userId: string; listId: string } & ApiParams;

const listSummaryRequest = (
  { fetch, userId, listId }: ListSummaryParams,
) =>
  api({ fetch })
    .users
    .lists
    .summary({
      params: {
        id: userId,
        list_id: listId,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch list summary');
      }

      return response.body;
    });

export const listSummaryQuery = defineQuery({
  key: 'listSummary',
  invalidations: [],
  dependencies: (params) => [params.userId, params.listId],
  request: listSummaryRequest,
  mapper: mapToMediaListSummary,
  schema: MediaListSummarySchema,
  ttl: time.minutes(30),
});
