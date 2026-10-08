import type { RecommendedByResponseInput } from '$lib/requests/queries/shares/recommendedByQuery.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';

export const RecommendedByResponseMock: RecommendedByResponseInput = {
  users: [{
    username: UserProfileHarryResponseMock.username,
    private: UserProfileHarryResponseMock.private,
    deleted: UserProfileHarryResponseMock.deleted,
    name: UserProfileHarryResponseMock.name,
    vip: UserProfileHarryResponseMock.vip,
    vip_ep: UserProfileHarryResponseMock.vip_ep,
    director: UserProfileHarryResponseMock.director,
    ids: UserProfileHarryResponseMock.ids,
    images: {
      avatar: { full: UserProfileHarryResponseMock.images?.avatar.full },
    },
  }],
  other_count: 2,
};
