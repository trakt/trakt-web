import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { followUserRequest } from '$lib/requests/queries/users/followUserRequest.ts';
import { unfollowUserRequest } from '$lib/requests/queries/users/unfollowUserRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, map } from 'rxjs';

export function useFollowUserRequest(slug: string) {
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Follow);
  const { network } = useUser();
  const isRequestingFollow = new BehaviorSubject(false);

  const isFollowed = network.pipe(map((n) => {
    if (!n) {
      isRequestingFollow.next(true);
      return false;
    }

    isRequestingFollow.next(false);
    return n.following.some((user) => user.slug === slug);
  }));

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

  return {
    isRequestingFollow,
    isFollowed,
    followUser,
    unfollowUser,
  };
}
