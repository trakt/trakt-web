import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';

type WatchableCalendarItem = UpcomingEpisodeEntry | MediaEntry;

function isCalendarItemWatchlisted(
  item: WatchableCalendarItem,
  watchlist: UserWatchlist,
): boolean {
  if ('show' in item) {
    return watchlist.shows.has(item.show.id);
  }

  if (item.type === 'movie') {
    return watchlist.movies.has(item.id);
  }

  return false;
}

type FilterWatchlistedCalendarItemsParams<T extends WatchableCalendarItem> = {
  items: Observable<T[]>;
  watchlist: Observable<UserWatchlist | undefined>;
  filter: FilterParams['filter'];
};

/*
  The calendar endpoints ignore the `ignore_watchlisted` filter server-side, so
  "hide watchlisted" is applied here against the user's watchlist. An episode is
  hidden when its show is watchlisted; a movie when the movie itself is
  watchlisted. While the watchlist is still loading, nothing is filtered so items
  don't flash in and out.
*/
export function filterWatchlistedCalendarItems<T extends WatchableCalendarItem>(
  {
    items,
    watchlist,
    filter,
  }: FilterWatchlistedCalendarItemsParams<T>,
): Observable<T[]> {
  const ignoreWatchlisted = `${filter?.ignore_watchlisted ?? ''}` === 'true';

  if (!ignoreWatchlisted) {
    return items;
  }

  return combineLatest([items, watchlist]).pipe(
    map(([$items, $watchlist]) =>
      $watchlist == null
        ? $items
        : $items.filter((item) => !isCalendarItemWatchlisted(item, $watchlist))
    ),
  );
}
