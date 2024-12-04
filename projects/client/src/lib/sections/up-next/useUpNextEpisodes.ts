import { browser } from '$app/environment';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import {
  upNextQuery,
  upNextQueryKey,
} from '$lib/requests/queries/sync/upNextQuery.ts';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const UP_NEXT_LIMIT = 100;

export const useUpNextEpisodes = () => {
  const client = browser ? useQueryClient() : undefined;
  const { current: user } = useUser();

  const query = createQuery(
    upNextQuery({
      limit: UP_NEXT_LIMIT,
      sort: user().preferences.progress.sort,
    }),
  );

  const reload = () => {
    client?.resetQueries({
      queryKey: upNextQueryKey,
    });
  };

  return {
    list: derived(query, ($query) => $query.data?.entries ?? []),
    reload,
  };
};
