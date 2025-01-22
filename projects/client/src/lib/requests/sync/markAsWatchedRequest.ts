import { api, type ApiParams } from '$lib/requests/api.ts';
import type { HistoryRequest } from '@trakt/api';

type MarkAsWatchedParams = {
  body: HistoryRequest;
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
    .then(({ status }) => status === 201);
}
