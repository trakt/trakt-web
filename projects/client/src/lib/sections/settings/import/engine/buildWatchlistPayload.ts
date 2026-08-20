import type { WatchlistRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import {
  EPISODE_IDS,
  MOVIE_IDS,
  pickIds,
  SEASON_IDS,
  SHOW_IDS,
} from './pickIds.ts';

type WatchlistMovie = NonNullable<WatchlistRequest['movies']>[number];
type WatchlistShow = NonNullable<WatchlistRequest['shows']>[number];
type WatchlistSeason = NonNullable<WatchlistRequest['seasons']>[number];
type WatchlistEpisode = NonNullable<WatchlistRequest['episodes']>[number];

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

function toWatchlistSeason(
  { ids }: UniversalImportItem,
): WatchlistSeason | null {
  const resolvedIds = pickIds(ids, SEASON_IDS);
  if (resolvedIds) return { ids: resolvedIds as never };
  return null;
}

function toWatchlistEpisode(
  { ids }: UniversalImportItem,
): WatchlistEpisode | null {
  const resolvedIds = pickIds(ids, EPISODE_IDS);
  if (resolvedIds) return { ids: resolvedIds as never };
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

  const seasons = items
    .filter((item) => item.type === 'season')
    .flatMap((item) => toWatchlistSeason(item) ?? []);

  const episodes = items
    .filter((item) => item.type === 'episode')
    .flatMap((item) => toWatchlistEpisode(item) ?? []);

  return { movies, shows, seasons, episodes };
}
