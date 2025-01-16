import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived, get } from 'svelte/store';
import { currentUserFavoritesQuery } from '../queries/currentUserFavoritesQuery.ts';
import { currentUserHistoryQuery } from '../queries/currentUserHistoryQuery.ts';
import { currentUserRatingsQuery } from '../queries/currentUserRatingsQuery.ts';
import { currentUserSettingsQuery } from '../queries/currentUserSettingsQuery.ts';
import {
  currentUserWatchlistQuery,
} from '../queries/currentUserWatchlistQuery.ts';

export function useUser() {
  const userQueryResponse = createQuery({
    ...currentUserSettingsQuery(),
    staleTime: Infinity,
  });

  const historyQueryResponse = createQuery({
    ...currentUserHistoryQuery(),
    staleTime: Infinity,
  });

  const watchlistQueryResponse = createQuery({
    ...currentUserWatchlistQuery(),
    staleTime: Infinity,
  });

  const ratingsQueryResponse = createQuery({
    ...currentUserRatingsQuery(),
    staleTime: Infinity,
  });

  const favoritesQueryResponse = createQuery({
    ...currentUserFavoritesQuery(),
    staleTime: Infinity,
  });

  const user = derived(userQueryResponse, ($query) => $query.data);
  const history = derived(historyQueryResponse, ($query) => $query.data);
  const watchlist = derived(
    watchlistQueryResponse,
    ($watchlist) => $watchlist.data,
  );
  const ratings = derived(ratingsQueryResponse, ($ratings) => $ratings.data);
  const favorites = derived(
    favoritesQueryResponse,
    ($favorites) => $favorites.data,
  );

  return {
    user,
    history,
    watchlist,
    ratings,
    favorites,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a RenderFor guard, target audience = authenticated!',
      ),
  };
}
