import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { upNextQuery } from '$lib/requests/queries/sync/upNextQuery.ts';
import { upNextQueryNitro } from '$lib/requests/queries/sync/upNextQueryNitro.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

const UP_NEXT_LIMIT = 100;

export const useUpNextEpisodes = (type: 'standard' | 'nitro') => {
  const { current: user } = useUser();

  const query = useQuery(
    (type === 'standard' ? upNextQuery : upNextQueryNitro)({
      limit: UP_NEXT_LIMIT,
      sort: user().preferences.progress.sort,
    }),
  );

  return {
    list: derived(
      query,
      ($query) =>
        ($query.data?.entries ?? []).filter((entry) =>
          entry.airDate.getTime() < Date.now()
        ),
    ),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
};
