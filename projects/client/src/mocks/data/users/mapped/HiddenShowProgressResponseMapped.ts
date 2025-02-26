import { HiddenShow } from '$lib/requests/models/HiddenShow.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';

export const HiddenShowProgressResponseMapped: HiddenShow[] = [
  {
    'hiddenAt': new Date('2025-02-26T12:55:10.000Z'),
    'show': {
      'airDate': MAX_DATE,
      'certification': undefined,
      'country': undefined,
      'cover': {
        'url': {
          'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
        },
      },
      'genres': [],
      'id': 180770,
      'languages': undefined,
      'overview': 'TBD',
      'poster': {
        'url': {
          'medium': '/placeholders/portrait_placeholder.png' as HttpsUrl,
          'thumb': '/placeholders/portrait_placeholder.png' as HttpsUrl,
        },
      },
      'runtime': NaN,
      'slug': 'silo',
      'status': 'unknown',
      'tagline': '',
      'thumb': {
        'url': '/placeholders/landscape_placeholder.png' as HttpsUrl,
      },
      'title': 'Silo',
      'trailer': 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
      'type': 'show',
      'votes': 0,
      'year': 2023,
    },
  },
];
