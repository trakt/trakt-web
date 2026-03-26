import type { WatchlistRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

export function buildWatchlistPayload(
  items: UniversalImportItem[],
): WatchlistRequest {
  const movies: NonNullable<WatchlistRequest['movies']> = [];
  const shows: NonNullable<WatchlistRequest['shows']> = [];

  for (const { type, ids, title, year } of items) {
    switch (type) {
      case 'movie': {
        const resolvedIds = pickIds(ids, MOVIE_IDS);
        if (resolvedIds) movies.push({ ids: resolvedIds as never });
        else if (title && year) movies.push({ title, year });
        break;
      }
      case 'show': {
        const resolvedIds = pickIds(ids, SHOW_IDS);
        if (resolvedIds) shows.push({ ids: resolvedIds as never });
        else if (title && year) shows.push({ title, year });
        break;
      }
    }
  }

  return { movies, shows };
}
