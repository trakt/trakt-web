import { useQuery } from '$lib/features/query/useQuery.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

export function useProfile(slug: string) {
  const response = useQuery(userProfileQuery({ slug }));

  return {
    user: derived(response, ($response) => $response.data),
    isLoading: derived(
      response,
      toLoadingState,
    ),
  };
}
