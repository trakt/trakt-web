import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

type IsCreditHiddenParams = {
  media: MediaEntry;
  history: UserHistory | null;
  watchlist: UserWatchlist | undefined;
  ignoreWatched: boolean;
  ignoreWatchlisted: boolean;
};

function isMediaWatched(media: MediaEntry, history: UserHistory): boolean {
  if (media.type === 'movie') {
    return history.movies.has(media.id);
  }

  // A credit only carries a base media entry (no total episode count), so
  // "watched" for a show means the user has watch history for it - matching how
  // discover's ignore_watched treats shows.
  if (media.type === 'show') {
    return history.shows.has(media.id);
  }

  return false;
}

function isMediaWatchlisted(
  media: MediaEntry,
  watchlist: UserWatchlist,
): boolean {
  if (media.type === 'movie') {
    return watchlist.movies.has(media.id);
  }

  if (media.type === 'show') {
    return watchlist.shows.has(media.id);
  }

  return false;
}

/*
  The person credits endpoints ignore the `ignore_watched` / `ignore_watchlisted`
  filters server-side, so the "Display Watched" / "Display Watchlisted" toggles
  are honored here against the user's history and watchlist. A credit is hidden
  when an active toggle matches its media. While a store is still loading
  (null/undefined) its toggle is treated as inactive so items don't flash in and
  out.
*/
export function isCreditHidden({
  media,
  history,
  watchlist,
  ignoreWatched,
  ignoreWatchlisted,
}: IsCreditHiddenParams): boolean {
  if (ignoreWatched && history != null && isMediaWatched(media, history)) {
    return true;
  }

  if (
    ignoreWatchlisted && watchlist != null &&
    isMediaWatchlisted(media, watchlist)
  ) {
    return true;
  }

  return false;
}
