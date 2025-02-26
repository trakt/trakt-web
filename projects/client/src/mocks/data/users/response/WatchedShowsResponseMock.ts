import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import type { WatchedShowsResponse } from '@trakt/api';

export const WatchedShowsResponseMock: WatchedShowsResponse = [
  {
    'plays': 8,
    'last_watched_at': '2024-12-27T16:28:32.000Z',
    'last_updated_at': '2024-12-27T16:28:32.000Z',
    'reset_at': null,
    'show': {
      'title': 'Devs',
      'year': 2020,
      'ids': {
        'trakt': 147971,
        'slug': 'devs',
        'tvdb': 364149,
        'imdb': 'tt8134186',
        'tmdb': 81349,
      },
      'aired_episodes': 8,
    },
    'seasons': [
      {
        'number': 0,
        'episodes': [
          {
            'number': 1,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
        ],
      },
      {
        'number': 1,
        'episodes': [
          {
            'number': 1,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 2,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 3,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 4,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 5,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 6,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 7,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
          {
            'number': 8,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:28:32.000Z',
          },
        ],
      },
    ],
  },
  {
    'plays': 1,
    'last_watched_at': '2024-12-27T16:13:42.000Z',
    'last_updated_at': '2024-12-27T16:13:43.000Z',
    'reset_at': null,
    'show': ShowSiloMinimalResponseMock,
    'seasons': [
      {
        'number': 1,
        'episodes': [
          {
            'number': 1,
            'plays': 1,
            'last_watched_at': '2024-12-27T16:13:42.000Z',
          },
        ],
      },
    ],
  },
];
