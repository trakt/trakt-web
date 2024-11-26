import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { currentUserQuery } from '../queries/currentUserQuery.ts';

export function useUser() {
  const query = createQuery({
    ...currentUserQuery(),
    staleTime: Infinity,
  });
  const user = derived(query, ($query) => $query.data);

  return user;
}
