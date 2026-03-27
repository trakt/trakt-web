import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type FavoritedEntry,
  FavoritedEntrySchema,
} from '$lib/requests/models/FavoritedEntry.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FavoriteShowResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';

type FavoriteShowsParams =
  & {
    slug: string;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

const favoritedShowsRequest = (
  { fetch, slug, limit, page, filter, sortBy, sortHow }: FavoriteShowsParams,
) =>
  api({ fetch })
    .users
    .favorites
    .shows({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images,colors',
        sort_by: sortBy ?? 'added',
        sort_how: sortHow ?? 'desc',
        page,
        limit,
        ...filter,
      },
    });

export function mapToFavoriteShow(
  entry: FavoriteShowResponse,
): FavoritedEntry {
  return {
    key: `show-${entry.show.ids.trakt}`,
    favoritedAt: new Date(entry.listed_at),
    rank: entry.rank,
    item: mapToShowEntry(entry.show),
  };
}

export const showFavoritesQuery = defineInfiniteQuery({
  key: 'showFavorites',
  invalidations: [InvalidateAction.Favorited('show')],
  dependencies: (params) => [
    params.slug,
    params.limit,
    params.page,
    params.sortBy,
    params.sortHow,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: favoritedShowsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToFavoriteShow),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(FavoritedEntrySchema),
  ttl: time.hours(1),
});
