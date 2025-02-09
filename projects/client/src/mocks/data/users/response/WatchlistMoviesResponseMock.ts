import type { ListedMovieResponse } from '@trakt/api';

export const WatchlistMoviesResponseMock: ListedMovieResponse[] = [
  {
    'rank': 1,
    'id': 1146014560,
    'listed_at': '2024-12-27T21:34:14.000Z',
    'notes': null,
    'type': 'movie',
    'movie': {
      'title': 'The Matrix',
      'year': 1999,
      'ids': {
        'trakt': 481,
        'slug': 'the-matrix-1999',
        'imdb': 'tt0133093',
        'tmdb': 603,
      },
    },
  },
];
