import type { SortType } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapListedMovieResponseToListItem } from '$lib/requests/_internal/mapListItemResponseToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';

type MovieWatchlistParams = {
  sort: SortType;
  page?: number;
  limit?: number;
} & ApiParams;

export const WatchlistMovieSchema = ListItemSchemaFactory(MovieEntrySchema);
export type WatchlistMovie = z.infer<typeof WatchlistMovieSchema>;

const watchlistRequest = (
  { fetch, sort, limit = DEFAULT_PAGE_SIZE, page = 1 }: MovieWatchlistParams,
) =>
  api({ fetch })
    .users
    .watchlist
    .movies({
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
        throw new Error('Failed to fetch movies watchlist');
      }

      return response;
    });

export const movieWatchlistQuery = defineQuery({
  key: 'movieWatchlist',
  invalidations: [
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: MovieWatchlistParams,
  ) => [params.sort, params.limit, params.page],
  request: watchlistRequest,
  mapper: (response) => ({
    entries: response.body.map(mapListedMovieResponseToListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(WatchlistMovieSchema),
  ttl: time.hours(1),
});
