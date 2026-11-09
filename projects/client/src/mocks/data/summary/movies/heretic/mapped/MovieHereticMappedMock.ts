import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';

export const MovieHereticMappedMock: MovieEntry = {
  cover: {
    url: {
      medium: 'https://media.trakt.tv/movies/916302/medium/fanart.webp',
      thumb: 'https://media.trakt.tv/movies/916302/thumb/fanart.webp',
    },
  },
  genres: ['horror', 'thriller'],
  colors: ['#A57B5D', '#1C130C'],
  status: 'released',
  rating: 0.7218,
  id: 916302,
  key: 'movie-916302',
  overview:
    'Two young missionaries are forced to prove their faith when they knock on the wrong door and are greeted by a diabolical Mr. Reed, becoming ensnared in his deadly game of cat-and-mouse.',
  poster: {
    url: {
      medium: 'https://media.trakt.tv/movies/916302/medium/poster.webp',
      thumb: 'https://media.trakt.tv/movies/916302/thumb/poster.webp',
    },
  },
  logo: {
    url: {
      medium: 'https://media.trakt.tv/movies/916302/medium/logo.webp',
      thumb: 'https://media.trakt.tv/movies/916302/medium/logo.webp',
    },
  },
  year: 2024,
  updatedAt: new Date('2024-12-15T08:05:20.000Z'),
  type: 'movie',
  runtime: 111,
  slug: 'heretic-2024',
  tagline: 'Question everything.',
  thumb: {
    url: 'https://media.trakt.tv/movies/916302/thumb/fanart.webp',
  },
  title: 'Heretic',
  originalTitle: 'Heretic',
  trailer: 'https://youtube.com/watch?v=jpWUOxRozZg',
  airDate: new Date('2024-11-08T00:00:00.000Z'),
  releaseDate: new Date('2024-11-08T00:00:00.000Z'),
  effectiveReleaseDate: new Date('2024-11-08T00:00:00.000Z'),
  certification: 'R',
  country: 'us',
  languages: ['da', 'en'],
  votes: 2083,
  plexSlug: 'heretic-2024',
  postCredits: [],
  imdbId: 'tt28015403',
  tmdbId: 1138194,
  homepage: 'https://a24films.com/films/heretic',
  socialMedia: undefined,
};
