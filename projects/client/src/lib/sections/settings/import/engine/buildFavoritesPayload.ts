import type { FavoritesRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

export function buildFavoritesPayload(
  items: ReadonlyArray<UniversalImportItem>,
): FavoritesRequest {
  const collect = (type: 'movie' | 'show', priority: typeof MOVIE_IDS) =>
    items
      .filter((item) => item.type === type)
      .flatMap((item) => {
        const ids = pickIds(item.ids, priority);
        return ids ? [{ ids }] : [];
      });

  return {
    movies: collect('movie', MOVIE_IDS),
    shows: collect('show', SHOW_IDS),
  } as FavoritesRequest;
}
