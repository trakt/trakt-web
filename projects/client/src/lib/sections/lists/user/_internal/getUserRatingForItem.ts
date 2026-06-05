import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import type { ProgressEntry } from '$lib/requests/models/ProgressEntry.ts';
import type { SortInput } from './formatSortValue.ts';

function isFavorited(item: SortInput): item is FavoritedEntry {
  return 'favoritedAt' in item;
}

function isProgress(item: SortInput): item is ProgressEntry {
  return 'type' in item && (item.type === 'watched' || item.type === 'dropped');
}

export function getUserRatingForItem(
  item: SortInput,
  ratings: UserRatings | undefined,
): number | undefined {
  if (!ratings) return undefined;

  if (isProgress(item)) {
    return ratings.shows.get(item.show.id)?.rating;
  }

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
