import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToShowListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SortType } from '@trakt/api';
import { z } from 'zod';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowWatchlistParams =
  & {
    sort: SortType;
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

export const WatchlistShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);
export const WatchlistShowSchema = ListItemSchemaFactory(
  WatchlistShowEntrySchema,
);

export type WatchlistShow = z.infer<typeof WatchlistShowSchema>;

const watchlistRequest = (
  { fetch, sort, limit, page, filter }: ShowWatchlistParams,
) =>
  api({ fetch })
    .users
    .watchlist
    .shows({
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

export const showWatchlistQuery = defineQuery({
  key: 'showWatchlist',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
  ],
  dependencies: (
    params: ShowWatchlistParams,
  ) => [
    params.sort,
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: watchlistRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToShowListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(WatchlistShowSchema),
  ttl: time.hours(1),
});
