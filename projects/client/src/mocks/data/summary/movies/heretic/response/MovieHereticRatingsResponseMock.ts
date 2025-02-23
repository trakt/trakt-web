import type { MovieRatingsResponse } from '@trakt/api';

export const MovieHereticRatingsResponseMock: MovieRatingsResponse = {
  'trakt': {
    'rating': 7.22561,
    'votes': 3803,
    'distribution': {
      '1': 22,
      '2': 20,
      '3': 31,
      '4': 60,
      '5': 195,
      '6': 637,
      '7': 1265,
      '8': 968,
      '9': 329,
      '10': 262,
    },
  },
  'tmdb': {
    'rating': 7.14,
    'votes': 563,
    'link': 'https://www.themoviedb.org/movie/1138194',
  },
  'imdb': {
    'rating': 7.1,
    'votes': 49905,
    'link': 'https://www.imdb.com/title/tt28015403',
  },
  'metascore': {
    'rating': 71,
    'link': 'http://www.imdb.com/title/tt28015403/criticreviews',
  },
  'rotten_tomatoes': {
    'rating': 0,
    'user_rating': 0,
    'link': 'http://www.rottentomatoes.com/m/heretic_2023',
  },
};
