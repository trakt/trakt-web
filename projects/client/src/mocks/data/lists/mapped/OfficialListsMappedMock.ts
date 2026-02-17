import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export const OfficialListsMappedMock: MediaListSummary[] = [
  {
    'description': 'This is super official',
    'id': 1234,
    'key': 'list-1234',
    'likeCount': 4161,
    'name': 'Official list',
    'slug': 'official-list',
    'count': 2,
    'sortBy': 'added',
    'sortHow': 'asc',
    'user': {
      'username': 'Trakt',
      'id': 0,
      'key': 'user-0',
      'avatar': {
        'url':
          'https://trakt.tv/assets/logos/logomark.circle.gradient-cb51d322e6bc3be6370499c6b61a906f8ef49c42a75e5e6d71aaeab2c6689061.svg',
      },
      'name': {
        'full': '',
        'first': '',
        'last': '',
      },
      'slug': null,
      'private': false,
      'isVip': false,
      'isDeleted': false,
      'isDirector': false,
      'about': undefined,
      'location': undefined,
      'cover': undefined,
    },
    'posters': [],
    'updatedAt': new Date('2025-02-09T21:39:59.000Z'),
    'type': 'official',
  },
];
