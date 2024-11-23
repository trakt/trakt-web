import type { WatchlistRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';
import { authHeader } from '../_internal/authHeader.ts';

type AddToWatchlistParams = {
  body: WatchlistRequest;
} & ApiParams;

export function addToWatchlist(
  { body, fetch }: AddToWatchlistParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .watchlist
    .add({
      body,
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status }) => status === 200);
}
