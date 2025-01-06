import type { HistoryRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';

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
