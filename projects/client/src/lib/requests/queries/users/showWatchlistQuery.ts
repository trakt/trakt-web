import type { SortType, WatchlistedShowsResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { time } from '$lib/utils/timing/time';
import { z } from 'zod';
import { ShowEntrySchema } from '../../models/ShowEntry';

type ShowWatchlistParams = {
  sort: SortType;
} & ApiParams;

export const WatchlistShowSchema = ListItemSchemaFactory(ShowEntrySchema);
export type WatchlistShow = z.infer<typeof WatchlistShowSchema>;

const watchlistRequest = ({ fetch, sort }: ShowWatchlistParams) =>
  api({ fetch })
    .users
    .watchlist
    .shows({
      params: {
        id: 'me',
        sort,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch shows watchlist');
      }

      return body;
    });

const mapResponseToWatchlist = (watchlistShow: WatchlistedShowsResponse) => ({
  id: watchlistShow.id,
  rank: watchlistShow.rank,
  notes: watchlistShow.notes,
  type: 'show' as const,
  listedAt: new Date(watchlistShow.listed_at),
  entry: mapShowResponseToShowSummary(watchlistShow.show),
});

export const showWatchlistQuery = defineQuery({
  key: 'showWatchlist',
  invalidations: [InvalidateAction.Watchlisted('show')],
  dependencies: (params: ShowWatchlistParams) => [params.sort],
  request: watchlistRequest,
  mapper: (body) => body.map(mapResponseToWatchlist),
  schema: WatchlistShowSchema.array(),
  ttl: time.hours(1),
});
