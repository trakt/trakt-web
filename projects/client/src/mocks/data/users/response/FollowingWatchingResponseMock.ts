import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import { UserWatchingResponseMock } from '$mocks/data/users/response/UserWatchingResponseMock.ts';

export const FollowingWatchingResponseMock = [
  { ...UserWatchingResponseMock, user: UserProfileHarryResponseMock },
];
