import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToEpisodeCount } from '$lib/requests/_internal/mapToEpisodeCount.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type FavoritedEntry,
  FavoritedEntrySchema,
} from '$lib/requests/models/FavoritedEntry.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FavoriteShowResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';

type FavoriteShowsParams =
  & {
    slug: string;
  }
  & ApiParams
  & FilterParams;

const favoritedShowsRequest = (
  { fetch, slug, filter }: FavoriteShowsParams,
) =>
  api({ fetch })
    .users
    .favorites
    .shows({
      params: {
        id: slug,
        sort: 'rank',
      },
      query: {
        extended: 'full,images,colors',
        ...filter,
      },
    });

function mapToFavoriteShow(
  entry: FavoriteShowResponse,
): FavoritedEntry {
  return {
    id: entry.show.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    rank: entry.rank,
    item: {
      ...mapToShowEntry(entry.show),
      ...mapToEpisodeCount(entry.show),
    },
  };
}

export const showFavoritesQuery = defineQuery({
  key: 'showFavorites',
  invalidations: [InvalidateAction.Favorited('show')],
  dependencies: (params) => [
    params.slug,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: favoritedShowsRequest,
  mapper: (response) => response.body.map(mapToFavoriteShow),
  schema: FavoritedEntrySchema.array(),
  ttl: time.hours(1),
});
