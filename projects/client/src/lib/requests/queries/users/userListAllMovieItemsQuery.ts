import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListedItemSchema } from '$lib/requests/models/ListedItem.ts';
import { time } from '$lib/utils/timing/time.ts';

export type UserListAllItemsParams =
  & {
    userId: string;
    listId: string;
  }
  & ApiParams;

const userListAllMovieItemsRequest = (
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
    .movie({
      params: {
        id: userId,
        list_id: listId,
      },
      query: {
        limit: 'all',
      },
    });

export const userListAllMovieItemsQuery = defineQuery({
  key: 'userListAllMovieItems',
  invalidations: [InvalidateAction.Listed('movie')],
  dependencies: (params) => [params.userId, params.listId],
  request: userListAllMovieItemsRequest,
  mapper: (response) => response.body.map(mapToListItem),
  schema: ListedItemSchema.array(),
  ttl: time.minutes(30),
});
