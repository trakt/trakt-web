import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { upNextNitroQuery } from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import { upNextQuery } from '$lib/requests/queries/sync/upNextQuery.ts';
import type { UpNextType } from '$lib/sections/lists/progress/useUpNextExperiment.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

export type UpNextStoreProps = {
  type: UpNextType;
  limit?: number;
  page?: number;
};

export const useUpNextList = (
  { type, ...params }: UpNextStoreProps,
) => {
  const { current: user } = useUser();

  const query = useQuery(
    (type === 'standard' ? upNextQuery : upNextNitroQuery)({
      sort: user().preferences.progress.sort,
      ...params,
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
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
};
