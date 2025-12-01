import type { MonthInReviewResponse } from '@trakt/api';
import { MovieHereticResponseMock } from '../../summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const UserMonthInReviewResponseMock: MonthInReviewResponse = {
  'stats': {
    'all': {
      'minutes': {
        'total': 736,
        'yearly': 736.0,
        'monthly': 122.66666666666667,
        'weekly': 32.0,
        'daily': 4.717948717948718,
      },
      'play_counts': {
        'total': 7,
        'yearly': 7.0,
        'monthly': 1.1666666666666667,
        'weekly': 0.30434782608695654,
        'daily': 0.04487179487179487,
      },
      'collected_counts': {
        'total': 1,
        'yearly': 1.0,
        'monthly': 0.16666666666666666,
        'weekly': 0.043478260869565216,
        'daily': 0.00641025641025641,
      },
      'ratings_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
      'comments_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
      'lists_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
    },
    'shows': {
      'minutes': {
        'total': 64,
        'yearly': 64.0,
        'monthly': 10.666666666666666,
        'weekly': 2.782608695652174,
        'daily': 0.41025641025641024,
      },
      'play_counts': {
        'total': 1,
        'yearly': 1.0,
        'monthly': 0.16666666666666666,
        'weekly': 0.043478260869565216,
        'daily': 0.00641025641025641,
      },
      'collected_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
      'ratings_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
      'comments_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
    },
    'movies': {
      'minutes': {
        'total': 672,
        'yearly': 672.0,
        'monthly': 112.0,
        'weekly': 29.217391304347824,
        'daily': 4.3076923076923075,
      },
      'play_counts': {
        'total': 6,
        'yearly': 6.0,
        'monthly': 1.0,
        'weekly': 0.2608695652173913,
        'daily': 0.038461538461538464,
      },
      'collected_counts': {
        'total': 1,
        'yearly': 1.0,
        'monthly': 0.16666666666666666,
        'weekly': 0.043478260869565216,
        'daily': 0.00641025641025641,
      },
      'ratings_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
      'comments_counts': {
        'total': 0,
        'yearly': 0.0,
        'monthly': 0.0,
        'weekly': 0.0,
        'daily': 0.0,
      },
    },
  },
  'images': {
    'cover':
      'https://widgets.trakt.tv/users/sefertrakt/mir.jpg?year=2025\u0026month=5\u0026shape=cover',
    'story':
      'https://widgets.trakt.tv/users/sefertrakt/mir.jpg?year=2025\u0026month=5\u0026shape=story',
  },
  'first_watched': {
    'type': 'movie',
    'watched_at': '2025-05-07T14:42:04.000Z',
    'movie': MovieHereticResponseMock,
  },
  'last_watched': {
    'type': 'movie',
    'watched_at': '2025-05-08T21:56:26.000Z',
    'movie': {
      'title': 'Screamboat',
      'year': 2025,
      'ids': {
        'trakt': 990203,
        'slug': 'screamboat-2025',
        'imdb': 'tt30766582',
        'tmdb': 1225572,
      },
      'images': {
        'fanart': [
          'walter-r2.trakt.tv/images/movies/000/990/203/fanarts/medium/69f983936a.jpg.webp',
        ],
        'poster': [
          'walter-r2.trakt.tv/images/movies/000/990/203/posters/thumb/c724960a49.jpg.webp',
        ],
        'logo': [],
        'clearart': [],
        'banner': [],
        'thumb': [],
      },
    },
  },
};
