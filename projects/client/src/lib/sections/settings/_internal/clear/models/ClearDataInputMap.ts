import type { UserCollection } from '$lib/features/auth/queries/currentUserCollectionQuery.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';

export type ClearDataInputMap = {
  watchlist: UserWatchlist;
  ratings: UserRatings;
  history: UserHistory;
  library: UserCollection;
};
