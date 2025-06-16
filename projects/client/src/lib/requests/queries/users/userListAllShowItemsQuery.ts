import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListedItemSchema } from '$lib/requests/models/ListedItem.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { UserListAllItemsParams } from './userListAllMovieItemsQuery.ts';

const userListAllShowItemsRequest = (
  {
    fetch,
    userId,
    listId,
  }: UserListAllItemsParams,
) =>
  api({ fetch })
    .users
    .lists
    .list
    .items
    .show({
      params: {
        id: userId,
        list_id: listId,
      },
      query: {
        limit: 'all',
      },
    });

export const userListAllShowItemsQuery = defineQuery({
  key: 'userListAllShowItems',
  invalidations: [InvalidateAction.Listed('show')],
  dependencies: (params) => [params.userId, params.listId],
  request: userListAllShowItemsRequest,
  mapper: (response) => response.body.map(mapToListItem),
  schema: ListedItemSchema.array(),
  ttl: time.minutes(30),
});
