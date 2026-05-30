import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import type { SortInput } from './formatSortValue.ts';

function isFavorited(item: SortInput): item is FavoritedEntry {
  return 'favoritedAt' in item;
}

export function getUserRatingForItem(
  item: SortInput,
  ratings: UserRatings | undefined,
): number | undefined {
  if (!ratings) return undefined;

  if (isFavorited(item)) {
    const id = item.item.id;
    return (ratings.movies.get(id) ?? ratings.shows.get(id))?.rating;
  }

  switch (item.type) {
    case 'movie':
      return ratings.movies.get(item.entry.id)?.rating;
    case 'show':
      return ratings.shows.get(item.entry.id)?.rating;
    case 'episode':
      return ratings.episodes.get(item.entry.episode.id)?.rating;
    default:
      return undefined;
  }
}
