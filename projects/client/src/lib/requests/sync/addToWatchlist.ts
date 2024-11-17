import type { WatchlistRequest } from '@trakt/api';
import { api } from '../_internal/api.ts';
import { authHeader } from '../_internal/authHeader.ts';

export function addToWatchlist(body: WatchlistRequest): Promise<boolean> {
  return api.sync.watchlist.add({
    body,
    extraHeaders: {
      ...authHeader(),
    },
  })
    .then(({ status }) => status === 200);
}
