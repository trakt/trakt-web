import type { UserFollowRequest } from '$lib/features/auth/queries/currentUserFollowRequestsQuery.ts';
import { UserProfileHarryMappedMock } from './UserProfileHarryMappedMock.ts';

export const UserFollowRequestsMappedMock: UserFollowRequest[] = [
  {
    id: 1,
    requestedAt: new Date('2025-01-31T23:12:41.000Z'),
    user: UserProfileHarryMappedMock,
  },
];
