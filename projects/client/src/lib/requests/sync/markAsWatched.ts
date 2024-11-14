import type { HistoryRequest } from '@trakt/api';
import { api } from '../_internal/api.ts';
import { authHeader } from '../_internal/authHeader.ts';

export function markAsWatched(body: HistoryRequest): Promise<boolean> {
  return api.sync.history.add({
    body,
    extraHeaders: {
      ...authHeader(),
    },
  })
    .then(({ status }) => status === 200);
}
