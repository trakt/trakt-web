import type { ShowRatingsResponse } from '@trakt/api';

export const ShowSiloRatingsResponseMock: ShowRatingsResponse = {
  'trakt': {
    'rating': 8.15357,
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
    'rating': 8.2,
    'votes': 1181,
    'link': 'https://www.themoviedb.org/tv/125988',
  },
  'imdb': {
    'rating': 8.1,
    'votes': 144574,
    'link': 'https://www.imdb.com/title/tt14688458',
  },
  'metascore': {
    'rating': null,
    'link': 'https://www.imdb.com/title/tt14688458/criticreviews',
  },
  'rotten_tomatoes': {
    'rating': 92,
    'user_rating': 64,
    'link': 'https://www.rottentomatoes.com/tv/silo',
  },
};
