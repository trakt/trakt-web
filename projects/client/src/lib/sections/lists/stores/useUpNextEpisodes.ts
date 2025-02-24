import { useQuery } from '$lib/features/query/useQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';
import { upNextNitroQuery } from '../../../requests/queries/sync/upNextNitroQuery.ts';

export const useUpNextEpisodes = () => {
  const query = useQuery(upNextNitroQuery());

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
