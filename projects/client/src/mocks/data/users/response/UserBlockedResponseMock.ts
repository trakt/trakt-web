import type { ProfileResponse } from '@trakt/api';
import { UserProfileHarryResponseMock } from './UserProfileHarryResponseMock.ts';

export type BlockedUserResponseEntry = {
  blocked_at: string;
  user: ProfileResponse;
};

export const UserBlockedResponseMock: BlockedUserResponseEntry[] = [
  {
    blocked_at: '2025-05-03T12:00:00.000Z',
    user: UserProfileHarryResponseMock,
  },
];
