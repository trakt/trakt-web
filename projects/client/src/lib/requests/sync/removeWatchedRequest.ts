import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
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
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status }) => status === 200);
}
