import type { MediaRating } from '$lib/requests/models/MediaRating.ts';

export const MovieHereticRatingsMappedMock: MediaRating = {
  'trakt': {
    'rating': 0.722561,
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
    'rating': 0.714,
    'votes': 563,
    'url': 'https://www.themoviedb.org/movie/1138194',
  },
  'rotten': {
    'critic': 0,
    'audience': 0,
    'url': 'https://www.rottentomatoes.com/m/heretic_2023',
  },
  'imdb': {
    'rating': 7.1,
    'votes': 49905,
    'url': 'https://www.imdb.com/title/tt28015403',
  },
  'metacritic': {
    'rating': 71,
    'url': 'https://www.imdb.com/title/tt28015403/criticreviews',
  },
};
