import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';

export function filterWatchedDates(
  history: UserHistory,
  mode: DiscoverMode,
): ReadonlyArray<Date> {
  const movies = mode !== 'show'
    ? [...history.movies.values()].flatMap((m) => m.watchedDates)
    : [];
  const shows = mode !== 'movie'
    ? [...history.shows.values()].flatMap((s) => s.watchedDates)
    : [];
  return [...movies, ...shows];
}
