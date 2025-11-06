import { api, type ApiParams } from '$lib/requests/api.ts';
import type { WatchlistRequest } from '@trakt/api';

type RemoveFromListParams = {
  body: WatchlistRequest;
  listId: string | number;
  userId?: string | number | Nil;
} & ApiParams;

export function removeFromListRequest(
  { body, fetch, listId, userId }: RemoveFromListParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .lists
    .list
    .remove({
      params: {
        id: `${userId ?? 'me'}`,
        list_id: `${listId}`,
      },
      body,
    })
    .then(({ status }) => status === 200);
}
