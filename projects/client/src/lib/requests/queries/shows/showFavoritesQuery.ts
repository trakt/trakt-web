import type { FavoritedShowsResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
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
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Error fetching user favorited shows.');
      }

      return response.body;
    });

function mapFavoritedShowResponse(
  entry: FavoritedShowsResponse,
): FavoritedEntry {
  return {
    id: entry.show.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    item: mapShowResponseToShowSummary(entry.show),
  };
}

export const showFavoritesQuery = defineQuery({
  key: 'showFavorites',
  invalidations: [InvalidateAction.Favorited('show')],
  dependencies: () => [],
  request: favoritedShowsRequest,
  mapper: (data) => data.map(mapFavoritedShowResponse),
  schema: FavoritedEntrySchema.array(),
  ttl: time.hours(1),
});
