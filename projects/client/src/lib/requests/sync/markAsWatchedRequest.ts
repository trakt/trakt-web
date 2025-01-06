import type { HistoryRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';

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
