import { api, type ApiParams } from '$lib/requests/api.ts';
import type { RecentSearchRequest } from '@trakt/api';

type RecentSearchParams = { body: RecentSearchRequest } & ApiParams;

export function recentSearchRequest(
  { fetch, body }: RecentSearchParams,
): Promise<boolean> {
  return api({ fetch })
    .search
    .recent
    .add({
      body,
    })
    .then(({ status }) => status === 201);
}
