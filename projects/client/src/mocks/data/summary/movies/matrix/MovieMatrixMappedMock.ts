import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';

export const MovieMatrixMappedMock: MovieEntry = {
  'id': 481,
  'key': 'movie-481',
  'slug': 'the-matrix-1999',
  'type': 'movie',
  'title': 'The Matrix',
  'originalTitle': 'The Matrix',
  'runtime': 136,
  'year': 1999,
  'tagline': 'The fight for the future begins.',
  'country': 'us',
  'status': 'released',
  'rating': 0.8755,
  'languages': [
    'en',
  ],
  'colors': [
    '#9AAAB4',
    '#141A2A',
  ],
  'poster': {
    'url': {
      'medium':
        'https://walter-r2.trakt.tv/images/movies/000/000/481/posters/medium/373310d2ee.jpg.webp',
      'thumb':
        'https://walter-r2.trakt.tv/images/movies/000/000/481/posters/thumb/373310d2ee.jpg.webp',
    },
  },
  'cover': {
    'url': {
      'medium':
        'https://walter-r2.trakt.tv/images/movies/000/000/481/fanarts/medium/c556867276.jpg.webp',
      'thumb':
        'https://walter-r2.trakt.tv/images/movies/000/000/481/fanarts/thumb/c556867276.jpg.webp',
    },
  },
  'logo': {
    'url': {
      'medium':
        'https://walter-r2.trakt.tv/images/movies/000/000/481/logos/medium/f5e05ed291.png.webp',
      'thumb':
        'https://walter-r2.trakt.tv/images/movies/000/000/481/logos/thumb/f5e05ed291.png.webp',
    },
  },
  'thumb': {
    'url':
      'https://walter-r2.trakt.tv/images/movies/000/000/481/fanarts/thumb/c556867276.jpg.webp',
  },
  'genres': [
    'action',
    'science-fiction',
  ],
  'overview':
    'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
  'trailer': 'https://youtube.com/watch?v=d0XTFAMmhrE',
  'airDate': new Date('1999-03-31T00:00:00.000Z'),
  'certification': 'R',
  'votes': 65943,
  'plexSlug': 'the-matrix-1999',
  'postCredits': [],
};
