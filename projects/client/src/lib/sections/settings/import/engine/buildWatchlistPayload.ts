import type { WatchlistRequest } from '@trakt/api';
import type { ImportType, UniversalImportItem } from '../ImportTypes.ts';
import {
  EPISODE_IDS,
  type IdPriority,
  MOVIE_IDS,
  pickIds,
  type ResolvedIds,
  SEASON_IDS,
  SHOW_IDS,
} from './pickIds.ts';

type WatchlistEntry =
  | { ids: ResolvedIds }
  | { title: string; year: number };

function toWatchlistEntry(
  { ids }: UniversalImportItem,
  priority: IdPriority,
): WatchlistEntry | null {
  const resolvedIds = pickIds(ids, priority);
  if (resolvedIds) return { ids: resolvedIds };
  return null;
}

// Only shows fall back to {title, year}: server-side text matching is too fuzzy
// for movies and mismatches pollute the watchlist, so unresolved movies are
// dropped instead (resolveMovieIds runs before this).
function toWatchlistShow(item: UniversalImportItem): WatchlistEntry | null {
  const entry = toWatchlistEntry(item, SHOW_IDS);
  if (entry) return entry;

  const { title, year } = item;
  if (title && year) return { title, year };
  return null;
}

export function buildWatchlistPayload(
  items: ReadonlyArray<UniversalImportItem>,
): WatchlistRequest {
  const collect = (
    type: ImportType,
    map: (item: UniversalImportItem) => WatchlistEntry | null,
  ) =>
    items
      .filter((item) => item.type === type)
      .flatMap((item) => map(item) ?? []);

  return {
    movies: collect('movie', (item) => toWatchlistEntry(item, MOVIE_IDS)),
    shows: collect('show', toWatchlistShow),
    seasons: collect('season', (item) => toWatchlistEntry(item, SEASON_IDS)),
    episodes: collect('episode', (item) => toWatchlistEntry(item, EPISODE_IDS)),
  } as WatchlistRequest;
}
