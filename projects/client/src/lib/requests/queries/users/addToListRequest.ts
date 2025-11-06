import { api, type ApiParams } from '$lib/requests/api.ts';
import type { WatchlistRequest } from '@trakt/api';

type AddToListParams = {
  body: WatchlistRequest;
  listId: string | number;
  userId?: string | number | Nil;
} & ApiParams;

export function addToListRequest(
  { body, fetch, listId, userId }: AddToListParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .lists
    .list
    .add({
      params: {
        id: `${userId ?? 'me'}`,
        list_id: `${listId}`,
      },
      body,
    })
    .then(({ status }) => status === 201);
}
