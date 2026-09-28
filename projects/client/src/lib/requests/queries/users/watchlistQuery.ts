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
import { z } from 'zod';
import type { SortBy } from '../../../sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '../../../sections/lists/user/models/SortDirection.ts';
import { ListItemSchema } from '../../models/ListItem.ts';

type WatchlistParams =
  & {
    sortBy: SortBy;
    sortHow?: SortDirection | Nil;
    type?: MediaType;
    hide?: 'unreleased';
    terms?: string | Nil;
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
  {
    fetch,
    sortBy,
    sortHow,
    type,
    limit,
    page,
    filter,
    hide,
    terms,
  }: WatchlistParams,
) => {
  const method = typeToWatchlistMethod(type);
  // `terms` is declared by @trakt/api 0.6.1; building the query first keeps it
  // past the inline excess-property check on 0.6.0, which sends it either way.
  const query = {
    extended: 'full,images,colors' as const,
    page,
    limit,
    sort_by: sortBy,
    sort_how: sortHow,
    hide,
    terms,
    ...filter,
  };

  return api({ fetch })
    .users
    .watchlist[method]({
      params: {
        id: 'me',
      },
      query,
    });
};

export const watchlistQuery = defineInfiniteQuery({
  key: 'watchlist',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
  ],
  dependencies: (
    params: WatchlistParams,
  ) => [
    params.type,
    params.sortBy,
    params.sortHow,
    params.limit,
    params.page,
    params.hide,
    params.terms,
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
