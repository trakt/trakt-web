import { browser } from '$app/environment';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import {
  upNextQuery,
  upNextQueryKey,
} from '$lib/requests/queries/sync/upNextQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const UP_NEXT_LIMIT = 100;

export const useUpNextEpisodes = () => {
  const client = browser ? useQueryClient() : undefined;
  const { current: user } = useUser();

  const query = createQuery({
    ...upNextQuery({
      limit: UP_NEXT_LIMIT,
      sort: user().preferences.progress.sort,
    }),
    gcTime: time.minutes(5),
    refetchOnWindowFocus: true,
  });

  const reload = () => {
    client?.invalidateQueries({
      queryKey: upNextQueryKey,
    });
  };

  return {
    list: derived(query, ($query) => $query.data?.entries ?? []),
    reload,
  };
};
