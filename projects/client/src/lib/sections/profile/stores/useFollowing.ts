import { useQuery } from '$lib/features/query/useQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map, shareReplay } from 'rxjs';
import { followersQuery } from '../../../requests/queries/users/followersQuery.ts';

export function useFollowing(slug: string, type: 'following' | 'followers') {
  const query = type === 'following'
    ? useQuery(followingQuery({ slug }))
    : useQuery(followersQuery({ slug }));

  const query$ = toObservable(query).pipe(shareReplay(1));

  return {
    profiles: query$.pipe(map((q) => q.data ?? [])),
    isLoading: query$.pipe(map(toLoadingState)),
  };
}
