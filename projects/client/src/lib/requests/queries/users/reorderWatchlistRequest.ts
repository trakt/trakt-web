import type { ApiParams } from '$lib/requests/api.ts';
import { postReorderRequest } from './_internal/postReorderRequest.ts';

type ReorderWatchlistParams = {
  rank: number[];
} & ApiParams;

export function reorderWatchlistRequest(
  { fetch, rank }: ReorderWatchlistParams,
): Promise<boolean> {
  return postReorderRequest({ fetch, path: '/sync/watchlist/reorder', rank });
}
