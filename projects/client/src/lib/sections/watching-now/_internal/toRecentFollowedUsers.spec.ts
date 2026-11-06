import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { FollowingActivityMappedMock } from '$mocks/data/users/mapped/FollowingActivityMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toRecentFollowedUsers } from './toRecentFollowedUsers.ts';

const base = assertDefined(FollowingActivityMappedMock.at(0));

function activity(
  slug: string | null,
  activityAt: string,
  isDeleted = false,
): FollowingActivity {
  return {
    ...base,
    key: `${slug}:${activityAt}`,
    activityAt: new Date(activityAt),
    user: {
      ...UserProfileHarryMappedMock,
      key: `user-${slug}`,
      slug,
      isDeleted,
    },
  };
}

describe('util: toRecentFollowedUsers', () => {
  it('should list each user once, most recent activity first', () => {
    const users = toRecentFollowedUsers({
      activities: [
        activity('kim', '2026-11-05T10:00:00Z'),
        activity('harry', '2026-11-05T12:00:00Z'),
        activity('kim', '2026-11-05T13:00:00Z'),
      ],
      limit: 10,
    });

    expect(users.map((user) => user.slug)).toEqual(['kim', 'harry']);
  });

  it('should cap the list at the limit', () => {
    const users = toRecentFollowedUsers({
      activities: [
        activity('a', '2026-11-05T10:00:00Z'),
        activity('b', '2026-11-05T11:00:00Z'),
        activity('c', '2026-11-05T12:00:00Z'),
      ],
      limit: 2,
    });

    expect(users.map((user) => user.slug)).toEqual(['c', 'b']);
  });

  it('should skip users without a slug and deleted users', () => {
    const users = toRecentFollowedUsers({
      activities: [
        activity(null, '2026-11-05T10:00:00Z'),
        activity('gone', '2026-11-05T11:00:00Z', true),
        activity('kim', '2026-11-05T09:00:00Z'),
      ],
      limit: 10,
    });

    expect(users.map((user) => user.slug)).toEqual(['kim']);
  });
});
