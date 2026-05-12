import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';

export type ClearDataInputMap = {
  watchlist: UserWatchlist;
  ratings: UserRatings;
};
