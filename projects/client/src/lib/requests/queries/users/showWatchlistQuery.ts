import type { SortType, WatchlistedShowsResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { type ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';

type ShowWatchlistParams = {
  sort: SortType;
} & ApiParams;

export type WatchlistShow = ListItem<ShowSummary>;

export function mapResponseToWatchlist(
  watchlist: WatchlistedShowsResponse,
): WatchlistShow[] {
  return watchlist.map((watchlistShow) => ({
    id: watchlistShow.id,
    rank: watchlistShow.rank,
    notes: watchlistShow.notes,
    type: 'show',
    listedAt: new Date(watchlistShow.listed_at),
    mediaItem: mapShowResponseToShowSummary(watchlistShow.show),
  }));
}

function watchlistRequest(
  { fetch, sort }: ShowWatchlistParams,
): Promise<WatchlistShow[]> {
  return api({ fetch })
    .users
    .watchlist
    .shows({
      params: {
        id: 'me',
        sort,
      },
      query: {
        extended: 'full,cloud9',
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch shows watchlist');
      }

      return mapResponseToWatchlist(body);
    });
}

const showWatchlistQueryKey = [
  'showWatchlist',
  InvalidateAction.Watchlisted('show'),
] as const;
export const showWatchlistQuery = (
  params: ShowWatchlistParams,
) => ({
  queryKey: showWatchlistQueryKey,
  queryFn: () => watchlistRequest(params),
});
