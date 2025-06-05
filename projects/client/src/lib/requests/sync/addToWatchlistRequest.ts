import { api, type ApiParams } from '$lib/requests/api.ts';
import { setMarker } from '$lib/utils/date/Marker.ts';
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
      setMarker();

      return status === 201;
    });
}
