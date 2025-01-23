import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { upNextQuery } from '$lib/requests/queries/sync/upNextQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const UP_NEXT_LIMIT = 100;

export const useUpNextEpisodes = () => {
  const { current: user } = useUser();

  const query = createQuery({
    ...upNextQuery({
      limit: UP_NEXT_LIMIT,
      sort: user().preferences.progress.sort,
    }),
    staleTime: time.minutes(5),
    refetchOnWindowFocus: true,
  });

  return {
    list: derived(query, ($query) => $query.data?.entries ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
};
