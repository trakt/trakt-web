import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';

export const ShowSiloMinimalMappedMock: ShowEntry = {
  'airDate': MAX_DATE,
  'certification': undefined,
  'country': undefined,
  'cover': {
    'url': {
      'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
      'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
    },
  },
  'logo': {
    'url': {
      'medium': '/placeholders/purple_placeholder.png' as HttpsUrl,
      'thumb': '/placeholders/landscape_placeholder.png' as HttpsUrl,
    },
  },
  'genres': [],
  'id': 180770,
  'key': 'show-180770',
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
  'rating': undefined,
  'tagline': '',
  'thumb': {
    'url': '/placeholders/landscape_placeholder.png' as HttpsUrl,
  },
  'title': 'Silo',
  'originalTitle': undefined,
  'trailer': 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
  'type': 'show',
  'votes': 0,
  'year': 2023,
  'colors': ['#D29D40', '#1E2E2F'],
  'plexSlug': undefined,
  'postCredits': [],
  'episode': {
    'count': 20,
  },
};
