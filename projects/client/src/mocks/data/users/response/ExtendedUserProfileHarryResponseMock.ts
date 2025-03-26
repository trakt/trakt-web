import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import type { ProfileResponse } from '@trakt/api';

export const ExtendedUserProfileHarryResponseMock: ProfileResponse = {
  ...UserProfileHarryResponseMock,
  location: 'San Francisco, CA',
  about: 'I am a Lieutenant',
  vip_cover_image:
    'https://walter.trakt.tv/images/users/014/366/083/headers/original/disco_cop.png',
};
