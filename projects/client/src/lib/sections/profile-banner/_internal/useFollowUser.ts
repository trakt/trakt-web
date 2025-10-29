import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { followUserRequest } from '$lib/requests/queries/users/followUserRequest.ts';
import { unfollowUserRequest } from '$lib/requests/queries/users/unfollowUserRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

type UseFollowUserProps = {
  slug: string;
  displayName: string;
};

export function useFollowUser({ slug, displayName }: UseFollowUserProps) {
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Follow);
  const { network } = useUser();
  const { confirm } = useConfirm();

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
    unfollowUser: confirm({
      type: ConfirmationType.UnfollowUser,
      username: displayName,
      onConfirm: unfollowUser,
    }),
  };
}
