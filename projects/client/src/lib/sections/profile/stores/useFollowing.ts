import { useQuery } from '$lib/features/query/useQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import { followersQuery } from '../../../requests/queries/users/followersQuery.ts';

export function useFollowing(slug: string, type: 'following' | 'followers') {
  const query = type === 'following'
    ? useQuery(followingQuery({ slug }))
    : useQuery(followersQuery({ slug }));

  return {
    profiles: query.pipe(map(($query) => $query.data ?? [])),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
