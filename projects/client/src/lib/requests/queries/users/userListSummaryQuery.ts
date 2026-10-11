import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type UserListSummaryParams = {
  userId: string;
  listId: string;
  withPosters?: boolean;
} & ApiParams;

const userListSummaryRequest = (
  { fetch, userId, listId, withPosters }: UserListSummaryParams,
) =>
  api({ fetch })
    .users
    .lists
    .list
    .summary({
      params: {
        id: userId,
        list_id: listId,
      },
      query: withPosters ? { extended: 'images' } : undefined,
    });

export const userListSummaryQuery = defineQuery({
  key: 'userListSummary',
  invalidations: [InvalidateAction.List.Edited, InvalidateAction.List.Like],
  dependencies: (params) => [
    params.userId,
    params.listId,
    params.withPosters,
  ],
  request: userListSummaryRequest,
  mapper: (response) => mapToMediaListSummary(response.body),
  schema: MediaListSummarySchema,
  ttl: time.minutes(30),
});
