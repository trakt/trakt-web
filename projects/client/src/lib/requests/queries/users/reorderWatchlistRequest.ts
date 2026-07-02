import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type ReorderWatchlistParams = {
  rank: number[];
} & ApiParams;

export async function reorderWatchlistRequest(
  { fetch, rank }: ReorderWatchlistParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: '/sync/watchlist/reorder',
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rank }),
    },
  });

  return response.status === 200;
}
