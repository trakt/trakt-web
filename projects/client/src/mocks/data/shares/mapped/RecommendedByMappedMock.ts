import type { RecommendedBy } from '$lib/requests/models/RecommendedBy.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const RecommendedByMappedMock: RecommendedBy = {
  users: [{
    ...UserProfileHarryMappedMock,
    about: null,
    location: null,
  }],
  otherCount: 2,
};
