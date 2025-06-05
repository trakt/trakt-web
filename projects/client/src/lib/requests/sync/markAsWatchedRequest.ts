import { api, type ApiParams } from '$lib/requests/api.ts';
import { setMarker } from '$lib/utils/date/Marker.ts';
import type { HistoryAddRequest } from '@trakt/api';

type MarkAsWatchedParams = {
  body: HistoryAddRequest;
} & ApiParams;

export function markAsWatchedRequest(
  { body, fetch }: MarkAsWatchedParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .history
    .add({
      body,
    })
    .then(({ status }) => {
      setMarker();

      return status === 201;
    });
}
