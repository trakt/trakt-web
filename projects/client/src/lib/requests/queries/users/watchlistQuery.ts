import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SortType } from '@trakt/api';
import { z } from 'zod';
import { ListItemSchema } from '../../models/ListItem.ts';

type WatchlistParams =
  & {
    sort: SortType;
    type?: MediaType;
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

export type WatchlistedItem = z.infer<typeof ListItemSchema>;

function typeToWatchlistMethod(type?: MediaType) {
  if (!type) {
    return 'all' as const;
  }

  switch (type) {
    case 'movie':
      return 'movies' as const;
    case 'show':
      return 'shows' as const;
  }
}

const watchlistRequest = (
  { fetch, sort, type, limit, page, filter }: WatchlistParams,
) => {
  const method = typeToWatchlistMethod(type);

  return api({ fetch })
    .users
    .watchlist[method]({
      params: {
        id: 'me',
        sort,
      },
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filter,
      },
    });
};

export const watchlistQuery = defineInfiniteQuery({
  key: 'watchlist',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
  ],
  dependencies: (
    params: WatchlistParams,
  ) => [
    params.type,
    params.sort,
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: watchlistRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ListItemSchema),
  ttl: time.hours(1),
});
