import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export const SiloListsMappedMock: MediaListSummary[] = [
  {
    'description': 'There is no escape from this list',
    'id': 5678,
    'name': 'Silos',
    'slug': 'silos',
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
