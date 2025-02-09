import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export const HereticListsMappedMock: MediaListSummary[] = [
  {
    'description': 'This list contains Heretic',
    'id': 1234,
    'name': 'Heretics only',
    'slug': 'heretics-only',
    'user': {
      'avatar': {
        'url':
          'https://walter-r2.trakt.tv/images/users/014/366/083/avatars/large/disco_cop.png',
      },
      'isVip': true,
      'slug': 'tequila_sunset',
      'userName': 'harrier_dubois',
    },
  },
];
