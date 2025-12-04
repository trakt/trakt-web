import type { WatchNowResponse } from '@trakt/api';

export const MovieHereticWatchNowResponseMock: WatchNowResponse = {
  'us': {
    'free': [],
    'subscription': [],
    'cable': [],
    'purchase': [
      {
        'source': 'google_play_movies',
        'link': 'trakt.tv/watchnow/189673385',
        'uhd': false,
        'currency': 'usd',
        'prices': {
          'rent': '19.99',
          'purchase': '24.99',
        },
      },
      {
        'source': 'youtube',
        'link': 'trakt.tv/watchnow/189673386',
        'uhd': false,
        'currency': 'usd',
        'prices': {
          'rent': '19.99',
          'purchase': '24.99',
        },
      },
      {
        'source': 'amazon_video',
        'link': 'trakt.tv/watchnow/189802504',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': '19.99',
          'purchase': '19.99',
        },
      },
      {
        'source': 'microsoft_store',
        'link': 'trakt.tv/watchnow/189110875',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': '19.99',
          'purchase': '19.99',
        },
      },
      {
        'source': 'apple_tv',
        'link': 'trakt.tv/watchnow/189110873',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': '19.99',
          'purchase': '24.99',
        },
      },
      {
        'source': 'fandango_at_home',
        'link': 'trakt.tv/watchnow/183946473',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': '19.99',
          'purchase': '19.99',
        },
      },
    ],
    'cinema': [],
    'streaming_ranks': {
      'rank': 142,
      'delta': 35,
    },
  },
};
