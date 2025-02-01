import type { WatchedMoviesResponse } from '@trakt/api';

export const WatchedMoviesResponseMock: WatchedMoviesResponse = [
  {
    'plays': 1,
    'last_watched_at': '2024-12-27T16:15:28.000Z',
    'last_updated_at': '2024-12-27T16:15:28.000Z',
    'movie': {
      'title': 'Heretic',
      'year': 2024,
      'ids': {
        'trakt': 916302,
        'slug': 'heretic-2024',
        'imdb': 'tt28015403',
        'tmdb': 1138194,
      },
    },
  },
];
