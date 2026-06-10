import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import {
  currentUserFollowRequestsQuery,
  type UserFollowRequest,
} from '$lib/features/auth/queries/currentUserFollowRequestsQuery.ts';
import { currentUserPendingFollowsQuery } from '$lib/features/auth/queries/currentUserPendingFollowsQuery.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { approveFollowRequest } from '$lib/requests/queries/users/approveFollowRequest.ts';
import { denyFollowRequest } from '$lib/requests/queries/users/denyFollowRequest.ts';
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
  const followRequestsQuerySignal = useQuery(currentUserFollowRequestsQuery());
  const isRequestingFollow = new BehaviorSubject(false);

  const pendingFollows = isAuthorized.pipe(
    switchMap((authorized) =>
      authorized
        ? pendingFollowsQuerySignal.pipe(map((query) => query.data))
        : of<UserProfile[]>([])
    ),
  );

  const followRequests = isAuthorized.pipe(
    switchMap((authorized) =>
      authorized
        ? followRequestsQuerySignal.pipe(map((query) => query.data ?? []))
        : of<UserFollowRequest[]>([])
    ),
  );

  const incomingFollowRequest = followRequests.pipe(
    map((requests) =>
      requests.find((request) => request.user.slug === slug) ?? null
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

  const respondToFollowRequest = async (
    action: (params: { requestId: number }) => Promise<boolean>,
    requestId: number,
  ): Promise<boolean> => {
    isRequestingFollow.next(true);

    try {
      const succeeded = await action({ requestId });
      if (succeeded) {
        await invalidate(InvalidateAction.User.Follow);
      }

      return succeeded;
    } finally {
      isRequestingFollow.next(false);
    }
  };

  const approveIncomingFollowRequest = (requestId: number) =>
    respondToFollowRequest(approveFollowRequest, requestId);

  const denyIncomingFollowRequest = (requestId: number) =>
    respondToFollowRequest(denyFollowRequest, requestId);

  return {
    approveIncomingFollowRequest,
    denyIncomingFollowRequest,
    incomingFollowRequest,
    isRequestingFollow,
    followStatus,
    followUser,
    unfollowUser,
    cancelFollowRequest,
  };
}
