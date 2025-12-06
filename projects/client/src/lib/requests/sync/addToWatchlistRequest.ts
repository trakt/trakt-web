import { api, type ApiParams } from '$lib/requests/api.ts';
import type { WatchlistRequest } from '@trakt/api';

type AddToWatchlistParams = {
  body: WatchlistRequest;
} & ApiParams;

export function addToWatchlistRequest(
  { body, fetch }: AddToWatchlistParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .watchlist
    .add({
      body,
    })
    .then(({ status }) => {
      return status === 201;
    });
}
