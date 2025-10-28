import type { Season } from '$lib/requests/models/Season.ts';

export const ShowSiloSeasonsMappedMock: Season[] = [
  {
    'id': 257490,
    'key': 'season-257490',
    'number': 1,
    'episodes': {
      'count': 10,
    },
    'poster': {
      'url': {
        'medium':
          'https://walter-r2.trakt.tv/images/seasons/000/257/490/posters/medium/091450c60d.jpg.webp',
        'thumb':
          'https://walter-r2.trakt.tv/images/seasons/000/257/490/posters/thumb/091450c60d.jpg.webp',
      },
    },
  },
  {
    'id': 402288,
    'key': 'season-402288',
    'number': 2,
    'episodes': {
      'count': 10,
    },
    'poster': {
      'url': {
        'medium':
          'https://walter-r2.trakt.tv/images/seasons/000/402/288/posters/medium/44533bd556.jpg.webp',
        'thumb':
          'https://walter-r2.trakt.tv/images/seasons/000/402/288/posters/thumb/44533bd556.jpg.webp',
      },
    },
  },
  {
    'id': 456019,
    'key': 'season-456019',
    'number': 3,
    'episodes': {
      'count': 1,
    },
    'poster': {
      'url': {
        'medium': '/placeholders/portrait_placeholder.png' as HttpsUrl,
        'thumb': '/placeholders/portrait_placeholder.png' as HttpsUrl,
      },
    },
  },
];
