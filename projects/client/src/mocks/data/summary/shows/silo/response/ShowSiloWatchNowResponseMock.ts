import type { WatchNowResponse } from '@trakt/api';

export const ShowSiloWatchNowResponseMock: WatchNowResponse = {
  'us': {
    'free': [
      {
        'source': 'apple_tv_plus',
        'link': 'trakt.tv/watchnow/185292672',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': null,
          'purchase': null,
        },
      },
      {
        'source': 'amazon_prime_video',
        'link': 'trakt.tv/watchnow/186099407',
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
        'link': 'trakt.tv/watchnow/181342180',
        'uhd': true,
        'currency': 'usd',
        'prices': {
          'rent': null,
          'purchase': null,
        },
      },
      {
        'source': 'apple_tv_plus',
        'link': 'trakt.tv/watchnow/194269876',
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
      'rank': 42,
      'delta': -3,
    },
  },
};
