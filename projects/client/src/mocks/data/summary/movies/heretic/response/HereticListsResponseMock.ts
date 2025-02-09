import type { ListResponse } from '$lib/api.ts';

export const HereticListsResponseMock: ListResponse[] = [
  {
    'name': 'Heretics only',
    'description': 'This list contains Heretic',
    'privacy': 'public',
    'share_link': 'https://trakt.tv/lists/1234',
    'type': 'personal',
    'display_numbers': false,
    'allow_comments': true,
    'sort_by': 'added',
    'sort_how': 'asc',
    'created_at': '2018-07-29T10:16:22.000Z',
    'updated_at': '2025-02-09T21:39:59.000Z',
    'item_count': 1,
    'comment_count': 5,
    'likes': 4161,
    'ids': {
      'trakt': 1234,
      'slug': 'heretics-only',
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
