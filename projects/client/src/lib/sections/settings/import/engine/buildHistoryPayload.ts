import type { HistoryAddRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { EPISODE_IDS, MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

export function buildHistoryPayload(
  items: UniversalImportItem[],
): HistoryAddRequest {
  const movies: NonNullable<HistoryAddRequest['movies']> = [];
  const shows: NonNullable<HistoryAddRequest['shows']> = [];
  const episodes: NonNullable<HistoryAddRequest['episodes']> = [];

  for (const { type, ids, title, year, watched_at } of items) {
    switch (type) {
      case 'movie': {
        const resolvedIds = pickIds(ids, MOVIE_IDS);
        if (resolvedIds) movies.push({ ids: resolvedIds as never, watched_at });
        else if (title && year) movies.push({ title, year, watched_at });
        break;
      }
      case 'show': {
        const resolvedIds = pickIds(ids, SHOW_IDS);
        if (resolvedIds) shows.push({ ids: resolvedIds as never, watched_at });
        else if (title && year) shows.push({ title, year, watched_at });
        break;
      }
      case 'episode': {
        const resolvedIds = pickIds(ids, EPISODE_IDS);
        if (resolvedIds) {
          episodes.push({ ids: resolvedIds as never, watched_at });
        } else if (ids.imdb) {
          shows.push({ ids: { imdb: ids.imdb }, watched_at });
        }
        break;
      }
    }
  }

  return { movies, shows, episodes };
}
