import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived, get } from 'svelte/store';
import { currentUserSettingsQuery } from '../queries/currentUserSettingsQuery.ts';

export function useUser() {
  const settings = createQuery({
    ...currentUserSettingsQuery(),
    staleTime: Infinity,
  });

  const user = derived(settings, ($query) => $query.data);

  return {
    user,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a user context provider!',
      ),
  };
}
