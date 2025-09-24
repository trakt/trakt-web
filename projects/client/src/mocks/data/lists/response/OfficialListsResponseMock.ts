import type { ListResponse } from '@trakt/api';

export const OfficialListsResponseMock: ListResponse[] = [
  {
    'name': 'Official list',
    'description': 'This is super official',
    'privacy': 'public',
    'share_link': 'https://trakt.tv/lists/1234',
    'type': 'official',
    'display_numbers': false,
    'allow_comments': true,
    'sort_by': 'added',
    'sort_how': 'asc',
    'created_at': '2018-07-29T10:16:22.000Z',
    'updated_at': '2025-02-09T21:39:59.000Z',
    'item_count': 2,
    'comment_count': 5,
    'likes': 4161,
    'ids': {
      'trakt': 1234,
      'slug': 'official-list',
    },
    'user': {
      'username': 'Trakt',
      'private': false,
      'deleted': false,
      'name': null,
      'vip': false,
      'vip_ep': false,
      'director': false,
      'ids': {
        'slug': null,
        'trakt': 0,
      },
      'images': {
        'avatar': {
          'full':
            'trakt.tv/assets/logos/logomark.circle.gradient-cb51d322e6bc3be6370499c6b61a906f8ef49c42a75e5e6d71aaeab2c6689061.svg',
        },
      },
    },
  },
];
