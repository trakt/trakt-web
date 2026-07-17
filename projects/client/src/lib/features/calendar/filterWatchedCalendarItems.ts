import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';

type WatchableCalendarItem = UpcomingEpisodeEntry | MediaEntry;

function isCalendarItemWatched(
  item: WatchableCalendarItem,
  history: UserHistory,
): boolean {
  if ('show' in item) {
    const watchedEpisodes = history.shows.get(item.show.id)?.episodes ?? [];

    // Common case: a single-episode card needs one membership check, so scan
    // directly instead of allocating a Set. Only grouped multi-episode cards
    // (checked with `every` below) benefit from the Set.
    if (item.episodes == null) {
      return watchedEpisodes.some((episode) => episode.episodeId === item.id);
    }

    const watchedIds = new Set(
      watchedEpisodes.map((episode) => episode.episodeId),
    );
    return item.episodes.every((episode) => watchedIds.has(episode.id));
  }

  if (item.type === 'movie') {
    return history.movies.has(item.id);
  }

  return false;
}

type FilterWatchedCalendarItemsParams<T extends WatchableCalendarItem> = {
  items: Observable<T[]>;
  history: Observable<UserHistory | null>;
  filter: FilterParams['filter'];
};

/*
  The calendar endpoints ignore the `ignore_watched` filter server-side, so
  "hide watched" is applied here against the user's watched history - the same
  store that drives the per-card watched checkmark. A grouped multi-episode card
  is only hidden when every episode it collapses has been watched. While history
  is still loading, nothing is filtered so items don't flash in and out.
*/
export function filterWatchedCalendarItems<T extends WatchableCalendarItem>({
  items,
  history,
  filter,
}: FilterWatchedCalendarItemsParams<T>): Observable<T[]> {
  const ignoreWatched = `${filter?.ignore_watched ?? ''}` === 'true';

  if (!ignoreWatched) {
    return items;
  }

  return combineLatest([items, history]).pipe(
    map(([$items, $history]) =>
      $history == null
        ? $items
        : $items.filter((item) => !isCalendarItemWatched(item, $history))
    ),
  );
}
