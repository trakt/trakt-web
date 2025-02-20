import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export const OfficialListsMappedMock: MediaListSummary[] = [
  {
    'description': 'This is super official',
    'id': 1234,
    'name': 'Official list',
    'slug': 'official-list',
    'user': {
      'username': 'Trakt',
      'avatar': {
        'url':
          'https://trakt.tv/assets/logos/logomark.circle.gradient-cb51d322e6bc3be6370499c6b61a906f8ef49c42a75e5e6d71aaeab2c6689061.svg',
      },
      'name': null,
      'slug': null,
      'private': false,
      'isVip': false,
      'isDeleted': false,
    },
  },
];
