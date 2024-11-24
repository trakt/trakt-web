import { currentUserQuery } from '$lib/requests/queries/users/currentUserQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useUser() {
  const query = createQuery(currentUserQuery());
  const user = derived(query, ($query) => $query.data);

  return user;
}
