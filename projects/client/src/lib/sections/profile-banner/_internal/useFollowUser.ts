import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { followUserRequest } from '$lib/requests/queries/users/followUserRequest.ts';
import { unfollowUserRequest } from '$lib/requests/queries/users/unfollowUserRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

export function useFollowUserRequest(slug: string) {
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Follow);
  const { network } = useUser();
  const isRequestingFollow = writable(false);

  const isFollowed = derived(network, ($network) => {
    if (!$network) {
      isRequestingFollow.set(true);
      return false;
    }

    isRequestingFollow.set(false);
    return $network.following.some((user) => user.slug === slug);
  });

  const followUser = async () => {
    isRequestingFollow.set(true);

    track({ action: 'follow' });
    await followUserRequest({ slug });
    await invalidate(InvalidateAction.User.Follow);

    isRequestingFollow.set(false);
  };

  const unfollowUser = async () => {
    isRequestingFollow.set(true);

    track({ action: 'unfollow' });
    await unfollowUserRequest({ slug });
    await invalidate(InvalidateAction.User.Follow);

    isRequestingFollow.set(false);
  };

  return {
    isRequestingFollow,
    isFollowed,
    followUser,
    unfollowUser,
  };
}
