import type { ShowRatingsResponse } from '@trakt/api';

export const EpisodeSiloRatingsResponseMock: ShowRatingsResponse = {
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
    'link': 'https://www.themoviedb.org/tv/125988/season/1/episode/1',
  },
  'imdb': {
    'rating': 8.1,
    'votes': 144574,
    'link': 'http://www.imdb.com/title/tt14693272',
  },
  'metascore': {
    'rating': null,
    'link': 'http://www.imdb.com/title/tt14693272/criticreviews',
  },
  'rotten_tomatoes': {
    'rating': 92,
    'user_rating': 64,
    'link': null,
  },
};
