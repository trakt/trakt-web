import { useQuery } from '$lib/features/query/useQuery.ts';
import { currentUserFollowRequestsQuery } from '$lib/features/auth/queries/currentUserFollowRequestsQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import { followersQuery } from '../../../requests/queries/users/followersQuery.ts';
import type { ProfileSocialListType } from '../models/ProfileSocialListType.ts';

export function useFollowing(slug: string, type: ProfileSocialListType) {
  if (type === 'requests') {
    const query = useQuery(currentUserFollowRequestsQuery());

    return {
      profiles: query.pipe(
        map(($query) => $query.data?.map((request) => request.user) ?? []),
      ),
      isLoading: query.pipe(map(toLoadingState)),
    };
  }

  const query = type === 'following'
    ? useQuery(followingQuery({ slug }))
    : useQuery(followersQuery({ slug }));

  return {
    profiles: query.pipe(map(($query) => $query.data ?? [])),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
