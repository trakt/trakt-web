import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HistoryRemoveRequest } from '@trakt/api';

type RemoveWatchedParams = {
  body: HistoryRemoveRequest;
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
    .then(({ status }) => {
      return status === 200;
    });
}
