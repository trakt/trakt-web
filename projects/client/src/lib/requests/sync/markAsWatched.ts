import type { HistoryRequest } from '@trakt/api';
import { api, type ApiParams } from '../_internal/api.ts';
import { authHeader } from '../_internal/authHeader.ts';

type MarkAsWatchedParams = {
  body: HistoryRequest;
} & ApiParams;

export function markAsWatched(
  { body, fetch }: MarkAsWatchedParams,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .history
    .add({
      body,
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status }) => status === 200);
}
