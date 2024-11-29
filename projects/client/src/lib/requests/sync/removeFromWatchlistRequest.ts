import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import type { WatchlistRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';

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
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status }) => status === 200);
}
