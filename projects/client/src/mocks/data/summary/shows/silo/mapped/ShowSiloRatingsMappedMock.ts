import type { MediaRating } from '$lib/requests/models/MediaRating.ts';

export const ShowSiloRatingsMappedMock: MediaRating = {
  'trakt': {
    'rating': 0.815357,
    'votes': 7241,
    'distribution': {
      '1': 40,
      '2': 21,
      '3': 26,
      '4': 39,
      '5': 128,
      '6': 318,
      '7': 1158,
      '8': 2654,
      '9': 1722,
      '10': 1130,
    },
  },
  'tmdb': {
    'rating': 0.82,
    'votes': 1181,
    'url': 'https://www.themoviedb.org/tv/125988',
  },
  'rotten': {
    'critic': 92,
    'audience': 64,
    'url': 'https://www.rottentomatoes.com/tv/silo',
  },
  'imdb': {
    'rating': 8.1,
    'votes': 144574,
    'url': 'https://www.imdb.com/title/tt14688458',
  },
  'metacritic': {
    'rating': 0,
    'url': 'https://www.imdb.com/title/tt14688458/criticreviews',
  },
};
