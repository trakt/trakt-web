import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export function buildFollowingActivity(
  overrides: Partial<FollowingActivity> = {},
): FollowingActivity {
  return {
    key: 'watch:1',
    activityAt: new Date('2026-09-28T10:00:00.000Z'),
    user: UserProfileHarryMappedMock,
    target: { type: 'movie', movie: MovieHereticMappedMock },
    detail: { action: 'watch' },
    ...overrides,
  };
}
