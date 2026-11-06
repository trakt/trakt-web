import type { FollowingWatching } from '$lib/requests/models/FollowingWatching.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { UserWatchingMappedMock } from '$mocks/data/users/mapped/UserWatchingMappedMock.ts';

export const FollowingWatchingMappedMock: FollowingWatching[] = [
  { user: UserProfileHarryMappedMock, nowPlaying: UserWatchingMappedMock },
];
