import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HistoryAddRequest } from '@trakt/api';
import { setMarker } from '../../utils/date/Marker.ts';

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
