import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { TopicId } from './models/TopicId.ts';
import { pickTopic } from './pickTopic.ts';

export function pickWatchlistTopic(
  watchlist: UserWatchlist | Nil,
): TopicId | null | undefined {
  if (!watchlist) return undefined;
  if (watchlist.movies.size === 0 && watchlist.shows.size === 0) {
    return undefined;
  }

  return pickTopic(watchlist.movies);
}
