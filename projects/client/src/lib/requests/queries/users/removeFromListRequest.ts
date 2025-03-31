import { api, type ApiParams } from '$lib/requests/api.ts';
import type { WatchlistRequest } from '@trakt/api';

type RemoveFromListParams = {
  body: WatchlistRequest;
  listId: string;
} & ApiParams;

export function removeFromListRequest(
  { body, fetch, listId }: RemoveFromListParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .lists
    .list
    .remove({
      params: {
        id: 'me',
        list_id: listId,
      },
      body,
    })
    .then(({ status }) => status === 200);
}
