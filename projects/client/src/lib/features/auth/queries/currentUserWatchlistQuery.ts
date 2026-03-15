import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { z } from 'zod';

const WatchlistMinimalResponseSchema = z.object({
  movies: z.array(z.number()),
  shows: z.array(z.number()),
});

const EMPTY_WATCHLIST_RESPONSE = { movies: [], shows: [] };

const UserWatchlistSchema = z.object({
  movies: z.set(z.number()),
  shows: z.set(z.number()),
});
export type UserWatchlist = z.infer<typeof UserWatchlistSchema>;

const currentUserWatchlistRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/watchlist/minimal',
  });

  if (!response.ok) {
    return { body: EMPTY_WATCHLIST_RESPONSE, status: 200 };
  }

  const parsed = WatchlistMinimalResponseSchema.safeParse(
    await response.json(),
  );

  return parsed.success
    ? { body: parsed.data, status: 200 }
    : { body: EMPTY_WATCHLIST_RESPONSE, status: 200 };
};

export const currentUserWatchlistQuery = defineQuery({
  key: 'currentUserWatchlist',
  request: currentUserWatchlistRequest,
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.Watchlisted('movie'),
  ],
  dependencies: [],
  mapper: (response) => ({
    movies: new Set(response.body.movies),
    shows: new Set(response.body.shows),
  }),
  schema: UserWatchlistSchema,
  ttl: Infinity,
});
