import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HistoryRequest } from '@trakt/api';

type RemoveWatchedParams = {
  body: HistoryRequest;
} & ApiParams;

export function removeWatchedRequest(
  { body, fetch }: RemoveWatchedParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .history
    .remove({
      body,
    })
    .then(({ status }) => status === 200);
}
