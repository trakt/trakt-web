import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived, get } from 'svelte/store';
import { currentUserHistoryQuery } from '../queries/currentUserHistoryQuery.ts';
import { currentUserSettingsQuery } from '../queries/currentUserSettingsQuery.ts';

export function useUser() {
  const userQueryResponse = createQuery({
    ...currentUserSettingsQuery(),
    staleTime: Infinity,
  });

  const historyQueryResponse = createQuery({
    ...currentUserHistoryQuery(),
    staleTime: Infinity,
  });

  const user = derived(userQueryResponse, ($query) => $query.data);
  const history = derived(historyQueryResponse, ($query) => $query.data);

  return {
    user,
    history,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a user context provider!',
      ),
  };
}
