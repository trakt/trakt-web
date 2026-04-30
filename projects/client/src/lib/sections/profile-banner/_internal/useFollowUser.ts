import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { currentUserPendingFollowsQuery } from '$lib/features/auth/queries/currentUserPendingFollowsQuery.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { followUserRequest } from '$lib/requests/queries/users/followUserRequest.ts';
import { unfollowUserRequest } from '$lib/requests/queries/users/unfollowUserRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, combineLatest, map, of, switchMap, tap } from 'rxjs';

export type FollowStatus = 'none' | 'pending' | 'following';

export function useFollowUserRequest(slug: string) {
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Follow);
  const { isAuthorized } = useAuth();
  const { network } = useUser();
  const pendingFollowsQuerySignal = useQuery(currentUserPendingFollowsQuery());
  const isRequestingFollow = new BehaviorSubject(false);

  const pendingFollows = isAuthorized.pipe(
    switchMap((authorized) =>
      authorized
        ? pendingFollowsQuerySignal.pipe(map((query) => query.data))
        : of<UserProfile[]>([])
    ),
  );

  const followStatus = combineLatest([network, pendingFollows]).pipe(
    tap(([$network, $pendingFollows]) => {
      const isReady = $network != null && $pendingFollows != null;
      isRequestingFollow.next(!isReady);
    }),
    map(([$network, $pendingFollows]): FollowStatus => {
      if ($network?.following.some((user) => user.slug === slug)) {
        return 'following';
      }

      if ($pendingFollows?.some((user) => user.slug === slug)) {
        return 'pending';
      }

      return 'none';
    }),
  );

  const followUser = async () => {
    isRequestingFollow.next(true);

    track({ action: 'follow' });
    await followUserRequest({ slug });
    await invalidate(InvalidateAction.User.Follow);

    isRequestingFollow.next(false);
  };

  const unfollowUser = async () => {
    isRequestingFollow.next(true);

    track({ action: 'unfollow' });
    await unfollowUserRequest({ slug });
    await invalidate(InvalidateAction.User.Follow);

    isRequestingFollow.next(false);
  };

  const cancelFollowRequest = async () => {
    isRequestingFollow.next(true);

    track({ action: 'cancel-follow-request' });
    await unfollowUserRequest({ slug });
    await invalidate(InvalidateAction.User.Follow);

    isRequestingFollow.next(false);
  };

  return {
    isRequestingFollow,
    followStatus,
    followUser,
    unfollowUser,
    cancelFollowRequest,
  };
}
