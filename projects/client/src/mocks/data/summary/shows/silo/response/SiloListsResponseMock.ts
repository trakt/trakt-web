import type { ListResponse } from '$lib/api.ts';

export const SiloListsResponseMock: ListResponse[] = [
  {
    'name': 'Silos',
    'description': 'There is no escape from this list',
    'privacy': 'public',
    'share_link': 'https://trakt.tv/lists/5678',
    'type': 'personal',
    'display_numbers': false,
    'allow_comments': true,
    'sort_by': 'added',
    'sort_how': 'asc',
    'created_at': '2018-07-29T10:16:22.000Z',
    'updated_at': '2025-02-09T21:39:59.000Z',
    'item_count': 1,
    'comment_count': 2,
    'likes': 892,
    'ids': {
      'trakt': 5678,
      'slug': 'silos',
    },
    'user': {
      'username': 'harrier_dubois',
      'private': false,
      'name': 'Harry Du Bois',
      'vip': true,
      'vip_ep': false,
      'ids': {
        'slug': 'tequila_sunset',
        'trakt': 41152,
      },
      'images': {
        'avatar': {
          'full':
            'https://walter-r2.trakt.tv/images/users/014/366/083/avatars/large/disco_cop.png',
        },
      },
    },
  },
];
