import { useQuery } from '$lib/features/query/useQuery.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

export function useProfile(slug: string) {
  const response = useQuery(userProfileQuery({ slug }));

  return {
    user: response.pipe(map(($response) => $response.data)),
    isLoading: response.pipe(map(toLoadingState)),
  };
}
