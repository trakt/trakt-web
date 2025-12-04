import type { WatchNowResponse } from '@trakt/api';

export const EpisodeSiloWatchNowResponseMock: WatchNowResponse = {
  'us': {
    'free': [
      {
        'source': 'apple_tv_plus',
        'link': 'trakt.tv/watchnow/185145020',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': null,
          'purchase': null,
        },
      },
      {
        'source': 'amazon_prime_video',
        'link': 'trakt.tv/watchnow/186099426',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': null,
          'purchase': null,
        },
      },
    ],
    'subscription': [
      {
        'source': 'apple_tv_plus_amazon_channel',
        'link': 'trakt.tv/watchnow/181597412',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': null,
          'purchase': null,
        },
      },
      {
        'source': 'apple_tv_plus',
        'link': 'trakt.tv/watchnow/194270962',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': null,
          'purchase': null,
        },
      },
    ],
    'cable': [],
    'purchase': [],
    'cinema': [],
    'streaming_ranks': {
      'rank': 67,
      'delta': -5,
    },
  },
};
