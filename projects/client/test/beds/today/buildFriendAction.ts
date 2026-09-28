import type { TodayFriendAction } from '$lib/sections/today/models/TodayFriendAction.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export function buildFriendAction(
  overrides: Partial<TodayFriendAction> = {},
): TodayFriendAction {
  return {
    key: 'watch:1',
    kind: 'watch',
    target: 'movie',
    user: UserProfileHarryMappedMock,
    activityAt: new Date('2026-09-28T10:00:00.000Z'),
    rating: null,
    comment: null,
    episode: null,
    episodeCount: 0,
    season: null,
    milestone: null,
    ...overrides,
  };
}
