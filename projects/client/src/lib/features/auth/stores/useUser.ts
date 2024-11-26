import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived, get } from 'svelte/store';
import { currentUserQuery } from '../queries/currentUserQuery.ts';

export function useUser() {
  const query = createQuery({
    ...currentUserQuery(),
    staleTime: Infinity,
  });

  const user = derived(query, ($query) => $query.data);

  return {
    user,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a user context provider!',
      ),
  };
}
