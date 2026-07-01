import type { Season } from '$lib/requests/models/Season.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';

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
    'airDate': new Date('2023-05-05T01:00:00.000Z'),
    'overview':
      'In a bleak dystopian future, humanity clings to survival deep underground within the confines of a colossal silo. Juliette, an engineer tasked with unraveling the mystery behind the death of a colleague, uncovers startling secrets that threaten the very fabric of their enclosed world.',
    'rating': 0.8054,
    'network': 'Apple TV+',
    'totalRuntime': 600,
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
    'airDate': new Date('2024-11-15T02:00:00.000Z'),
    'overview':
      'Stranded outside her silo with a failing suit, Juliette Nichols races against time, stunned to find another silo nearby that could be her only hope for survival. Meanwhile, unrest brews inside her original silo as Bernard Holland rallies citizens to maintain order amid rising questions about their world. As Juliette faces unexpected dangers near the new silo, hidden truths about the silos’ origins and the world beyond begin to surface, deepening the mystery.',
    'rating': 0.7406,
    'network': 'Apple TV+',
    'totalRuntime': 600,
  },
  {
    'id': 456019,
    'key': 'season-456019',
    'number': 3,
    'episodes': {
      'count': 1,
    },
    'poster': undefined,
    'airDate': MAX_DATE,
    'overview': null,
    'rating': 0.5,
    'network': 'Apple TV+',
    'totalRuntime': 60,
  },
];
