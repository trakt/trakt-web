import { useQuery } from '$lib/features/query/useQuery.ts';
import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type SocialActivityListProps = {
  limit?: number;
  page?: number;
};

export function useSocialActivityList(props: SocialActivityListProps) {
  const query = useQuery(
    socialActivityQuery(props),
  );

  const isLoading = derived(
    query,
    toLoadingState,
  );

  const list = derived(query, ($query) => $query.data?.entries ?? []);
  const page = derived(
    query,
    ($query) => $query.data?.page ?? { page: 0, total: 0 },
  );

  return {
    list,
    page,
    isLoading,
  };
}
