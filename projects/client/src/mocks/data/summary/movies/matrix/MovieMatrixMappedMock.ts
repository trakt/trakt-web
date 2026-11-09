import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';

export const MovieMatrixMappedMock: MovieEntry = {
  id: 481,
  key: 'movie-481',
  slug: 'the-matrix-1999',
  type: 'movie',
  title: 'The Matrix',
  originalTitle: 'The Matrix',
  runtime: 136,
  year: 1999,
  updatedAt: new Date('2024-12-27T15:30:51.000Z'),
  tagline: 'The fight for the future begins.',
  country: 'us',
  status: 'released',
  rating: 0.8755,
  languages: ['en'],
  colors: ['#9AAAB4', '#141A2A'],
  poster: {
    url: {
      medium: 'https://media.trakt.tv/movies/481/medium/poster.webp',
      thumb: 'https://media.trakt.tv/movies/481/thumb/poster.webp',
    },
  },
  cover: {
    url: {
      medium: 'https://media.trakt.tv/movies/481/medium/fanart.webp',
      thumb: 'https://media.trakt.tv/movies/481/thumb/fanart.webp',
    },
  },
  logo: {
    url: {
      medium: 'https://media.trakt.tv/movies/481/medium/logo.webp',
      thumb: 'https://media.trakt.tv/movies/481/medium/logo.webp',
    },
  },
  thumb: {
    url: 'https://media.trakt.tv/movies/481/thumb/fanart.webp',
  },
  genres: ['action', 'science-fiction'],
  overview:
    'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
  trailer: 'https://youtube.com/watch?v=d0XTFAMmhrE',
  airDate: new Date('1999-03-31T00:00:00.000Z'),
  releaseDate: new Date('1999-03-31T00:00:00.000Z'),
  effectiveReleaseDate: new Date('1999-03-31T00:00:00.000Z'),
  certification: 'R',
  votes: 65943,
  plexSlug: 'the-matrix-1999',
  postCredits: [],
  imdbId: 'tt0133093',
  tmdbId: 603,
  homepage: 'https://www.warnerbros.com/matrix',
  socialMedia: {
    x: null,
    facebook: 'TheMatrixMovie',
    instagram: null,
    wikipedia: 'The_Matrix',
  },
};
