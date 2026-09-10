import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import {
  currentUserFollowRequestsQuery,
  type UserFollowRequest,
} from '$lib/features/auth/queries/currentUserFollowRequestsQuery.ts';
import { currentUserPendingFollowsQuery } from '$lib/features/auth/queries/currentUserPendingFollowsQuery.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { approveFollowRequest } from '$lib/requests/queries/users/approveFollowRequest.ts';
import { denyFollowRequest } from '$lib/requests/queries/users/denyFollowRequest.ts';
import { followUserRequest } from '$lib/requests/queries/users/followUserRequest.ts';
import { unfollowUserRequest } from '$lib/requests/queries/users/unfollowUserRequest.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { combineLatest, map, of, startWith, switchMap } from 'rxjs';

export type FollowStatus = 'none' | 'pending' | 'following';

const followInvalidations = [InvalidateAction.User.Follow];

export function useFollowUserRequest(slug: string) {
  const { track } = useTrack(AnalyticsEvent.Follow);
  const { isAuthorized } = useAuth();
  const { network } = useUser();
  const pendingFollowsQuerySignal = useQuery(currentUserPendingFollowsQuery());
  const followRequestsQuerySignal = useQuery(currentUserFollowRequestsQuery());

  const follow = useMutation(defineMutation({
    key: 'user:follow',
    request: () => followUserRequest({ slug }),
    invalidations: followInvalidations,
  }));

  const unfollow = useMutation(defineMutation({
    key: 'user:unfollow',
    request: () => unfollowUserRequest({ slug }),
    invalidations: followInvalidations,
  }));

  const approve = useMutation(defineMutation({
    key: 'user:approve-follow-request',
    request: (requestId: number) => approveFollowRequest({ requestId }),
    invalidations: ({ data }) => data ? followInvalidations : [],
  }));

  const deny = useMutation(defineMutation({
    key: 'user:deny-follow-request',
    request: (requestId: number) => denyFollowRequest({ requestId }),
    invalidations: ({ data }) => data ? followInvalidations : [],
  }));

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

  const followState = combineLatest([network, pendingFollows]);

  const followStatus = followState.pipe(
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

  const isFollowStateUnsettled = followState.pipe(
    map(([$network, $pendingFollows]) =>
      $network == null || $pendingFollows == null
    ),
  );

  const isRequestingFollow = anyTrue([
    isFollowStateUnsettled,
    follow.isPending,
    unfollow.isPending,
    approve.isPending,
    deny.isPending,
  ]).pipe(startWith(false));

  const followUser = async () => {
    track({ action: 'follow' });

    await follow.mutate();
  };

  const unfollowUser = async () => {
    track({ action: 'unfollow' });

    await unfollow.mutate();
  };

  const cancelFollowRequest = async () => {
    track({ action: 'cancel-follow-request' });

    await unfollow.mutate();
  };

  return {
    approveIncomingFollowRequest: approve.mutate,
    denyIncomingFollowRequest: deny.mutate,
    incomingFollowRequest,
    isRequestingFollow,
    followStatus,
    followUser,
    unfollowUser,
    cancelFollowRequest,
  };
}
