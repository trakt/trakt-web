import { HiddenShowItemResponse } from '$lib/api.ts';

export const HiddenShowProgressResponseMock: HiddenShowItemResponse[] = [
  {
    'hidden_at': '2025-02-26T12:55:10.000Z',
    'type': 'show',
    'show': {
      'title': 'Silo',
      'year': 2023,
      'ids': {
        'trakt': 180770,
        'slug': 'silo',
        'tvdb': 403245,
        'imdb': 'tt14688458',
        'tmdb': 125988,
      },
      'aired_episodes': 20,
    },
  },
];
