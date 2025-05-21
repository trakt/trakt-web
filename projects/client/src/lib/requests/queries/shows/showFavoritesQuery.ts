import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FavoriteShowResponse } from '@trakt/api';
import {
  type FavoritedEntry,
  FavoritedEntrySchema,
} from '../../models/FavoritedEntry.ts';

const favoritedShowsRequest = (
  { fetch }: ApiParams,
) =>
  api({ fetch })
    .users
    .favorites
    .shows({
      params: {
        id: 'me',
        sort: 'rank',
      },
      query: {
        extended: 'full,images',
      },
    });

function mapToFavoriteShow(
  entry: FavoriteShowResponse,
): FavoritedEntry {
  return {
    id: entry.show.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    item: mapToShowEntry(entry.show),
  };
}

export const showFavoritesQuery = defineQuery({
  key: 'showFavorites',
  invalidations: [InvalidateAction.Favorited('show')],
  dependencies: () => [],
  request: favoritedShowsRequest,
  mapper: (response) => response.body.map(mapToFavoriteShow),
  schema: FavoritedEntrySchema.array(),
  ttl: time.hours(1),
});
