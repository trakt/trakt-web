import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';

type RecentFollowedUsersParams = {
  activities: ReadonlyArray<FollowingActivity>;
  limit: number;
};

export function toRecentFollowedUsers({
  activities,
  limit,
}: RecentFollowedUsersParams): ReadonlyArray<UserProfile> {
  const users = activities
    .toSorted((a, b) => b.activityAt.getTime() - a.activityAt.getTime())
    .map((activity) => activity.user)
    .filter((user) => user.slug != null && !user.isDeleted);

  return dedupe((user) => user.key, users).slice(0, limit);
}
