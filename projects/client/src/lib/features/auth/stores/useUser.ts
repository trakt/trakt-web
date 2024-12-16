import { browser } from '$app/environment';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { derived, get } from 'svelte/store';
import {
  currentUserHistoryQuery,
  currentUserHistoryQueryKey,
} from '../queries/currentUserHistoryQuery.ts';
import { currentUserSettingsQuery } from '../queries/currentUserSettingsQuery.ts';
import {
  currentUserWatchlistQuery,
  currentUserWatchlistQueryKey,
} from '../queries/currentUserWatchlistQuery.ts';

export function useUser() {
  const client = browser ? useQueryClient() : undefined;

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

  const reloadHistory = () => {
    client?.invalidateQueries({
      queryKey: currentUserHistoryQueryKey,
    });
  };

  const reloadWatchlist = () => {
    client?.invalidateQueries({
      queryKey: currentUserWatchlistQueryKey,
    });
  };

  const user = derived(userQueryResponse, ($query) => $query.data);
  const history = derived(historyQueryResponse, ($query) => $query.data);
  const watchlist = derived(
    watchlistQueryResponse,
    ($watchlist) => $watchlist.data,
  );

  return {
    user,
    history,
    reloadHistory,
    watchlist,
    reloadWatchlist,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a RenderFor guard, target audience = authenticated!',
      ),
  };
}
