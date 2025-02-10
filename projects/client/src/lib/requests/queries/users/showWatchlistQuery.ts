import type { SortType, WatchlistedShowsResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapShowResponseToEpisodeCount } from '$lib/requests/_internal/mapShowResponseToEpisodeCount.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type ShowWatchlistParams = {
  sort: SortType;
  page?: number;
  limit?: number;
} & ApiParams;

export const WatchlistShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);
export const WatchlistShowSchema = ListItemSchemaFactory(
  WatchlistShowEntrySchema,
);

export type WatchlistShow = z.infer<typeof WatchlistShowSchema>;

const watchlistRequest = (
  { fetch, sort, limit = DEFAULT_PAGE_SIZE, page = 1 }: ShowWatchlistParams,
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
        extended: 'full,images',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch shows watchlist');
      }

      return response;
    });

const mapResponseToWatchlist = (
  watchlistShow: WatchlistedShowsResponse,
): WatchlistShow => ({
  id: watchlistShow.id,
  rank: watchlistShow.rank,
  notes: watchlistShow.notes,
  type: 'show' as const,
  listedAt: new Date(watchlistShow.listed_at),
  entry: {
    ...mapShowResponseToShowSummary(watchlistShow.show),
    ...mapShowResponseToEpisodeCount(watchlistShow.show),
  },
});

export const showWatchlistQuery = defineQuery({
  key: 'showWatchlist',
  invalidations: [InvalidateAction.Watchlisted('show')],
  dependencies: (
    params: ShowWatchlistParams,
  ) => [params.sort, params.limit, params.page],
  request: watchlistRequest,
  mapper: (response) => ({
    entries: response.body.map(mapResponseToWatchlist),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(WatchlistShowSchema),
  ttl: time.hours(1),
});
