import type { WatchlistRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

type WatchlistMovie = NonNullable<WatchlistRequest['movies']>[number];
type WatchlistShow = NonNullable<WatchlistRequest['shows']>[number];

// Movies never fall back to {title, year}: server-side text matching
// is too fuzzy and mismatches pollute the watchlist. Unresolved movies
// are dropped instead (resolveMovieIds runs before this).
function toWatchlistMovie(
  { ids }: UniversalImportItem,
): WatchlistMovie | null {
  const resolvedIds = pickIds(ids, MOVIE_IDS);
  if (resolvedIds) return { ids: resolvedIds as never };
  return null;
}

function toWatchlistShow(
  { ids, title, year }: UniversalImportItem,
): WatchlistShow | null {
  const resolvedIds = pickIds(ids, SHOW_IDS);
  if (resolvedIds) return { ids: resolvedIds as never };
  if (title && year) return { title, year };
  return null;
}

export function buildWatchlistPayload(
  items: UniversalImportItem[],
): WatchlistRequest {
  const movies = items
    .filter((item) => item.type === 'movie')
    .flatMap((item) => toWatchlistMovie(item) ?? []);

  const shows = items
    .filter((item) => item.type === 'show')
    .flatMap((item) => toWatchlistShow(item) ?? []);

  return { movies, shows };
}
