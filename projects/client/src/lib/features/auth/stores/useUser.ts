import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived, get } from 'svelte/store';
import { currentUserHistoryQuery } from '../queries/currentUserHistoryQuery.ts';
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

  const user = derived(userQueryResponse, ($query) => $query.data);
  const history = derived(historyQueryResponse, ($query) => $query.data);
  const watchlist = derived(
    watchlistQueryResponse,
    ($watchlist) => $watchlist.data,
  );

  return {
    user,
    history,
    watchlist,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a RenderFor guard, target audience = authenticated!',
      ),
  };
}
