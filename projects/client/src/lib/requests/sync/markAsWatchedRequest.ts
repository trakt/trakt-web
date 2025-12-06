import { api, type ApiParams } from '$lib/requests/api.ts';
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
      return status === 201;
    });
}
