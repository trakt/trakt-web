import { useQuery } from '$lib/features/query/useQuery.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export function useProfile(slug: string) {
  const response = useQuery(userProfileQuery({ slug }));
  const response$ = toObservable(response);

  return {
    user: response$.pipe(map((r) => r.data)),
    isLoading: response$.pipe(map(toLoadingState)),
  };
}
