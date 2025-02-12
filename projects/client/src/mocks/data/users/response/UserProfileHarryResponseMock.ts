import type { ProfileResponse } from '$lib/api.ts';

export const UserProfileHarryResponseMock: ProfileResponse = {
  'username': 'harrier_dubois',
  'private': false,
  'name': 'Harry Du Bois',
  'vip': true,
  'vip_ep': false,
  'ids': {
    'slug': 'harry_du_bois',
    'trakt': 41152,
  },
  'images': {
    'avatar': {
      'full':
        'https://walter-r2.trakt.tv/images/users/014/366/083/avatars/large/disco_cop.png',
    },
  },
};
