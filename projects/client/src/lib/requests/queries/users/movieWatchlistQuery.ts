import type { SortType, WatchlistedMoviesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../_internal/api.ts';
import { MovieEntrySchema } from '../../models/MovieEntry';

type MovieWatchlistParams = {
  sort: SortType;
} & ApiParams;

export const WatchlistMovieSchema = ListItemSchemaFactory(MovieEntrySchema);
export type WatchlistMovie = z.infer<typeof WatchlistMovieSchema>;

const watchlistRequest = ({ fetch, sort }: MovieWatchlistParams) =>
  api({ fetch })
    .users
    .watchlist
    .movies({
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
        throw new Error('Failed to fetch movies watchlist');
      }

      return body;
    });

const mapResponseToWatchlist = (watchlistMovie: WatchlistedMoviesResponse) => ({
  id: watchlistMovie.id,
  rank: watchlistMovie.rank,
  notes: watchlistMovie.notes,
  type: 'movie' as const,
  listedAt: new Date(watchlistMovie.listed_at),
  entry: mapMovieResponseToMovieSummary(watchlistMovie.movie),
});

export const movieWatchlistQuery = await defineQuery({
  key: 'movieWatchlist',
  invalidations: [InvalidateAction.Watchlisted('movie')],
  dependencies: (params: MovieWatchlistParams) => [params.sort],
  request: watchlistRequest,
  mapper: (body) => body.map(mapResponseToWatchlist),
  schema: WatchlistMovieSchema.array(),
});
