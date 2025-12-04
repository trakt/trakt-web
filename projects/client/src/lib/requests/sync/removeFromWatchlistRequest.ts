import { api, type ApiParams } from '$lib/requests/api.ts';
import type { WatchlistRequest } from '@trakt/api';

type RemoveFromWatchlistParams = {
  body: WatchlistRequest;
} & ApiParams;

export function removeFromWatchlistRequest(
  { body, fetch }: RemoveFromWatchlistParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .watchlist
    .remove({
      body,
    })
    .then(({ status }) => {
      return status === 200;
    });
}
