import type { WatchNowServices } from '$lib/requests/models/WatchNowServices';

export const MovieHereticWatchedNowMappedMock: WatchNowServices = {
  'onDemand': [
    {
      'currency': 'usd',
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/189110873',
      'prices': {
        'purchase': 24.99,
        'rent': 19.99,
      },
      'source': 'apple_tv',
      'type': 'on-demand',
    },
    {
      'currency': 'usd',
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/189802504',
      'prices': {
        'purchase': 19.99,
        'rent': 19.99,
      },
      'source': 'amazon_video',
      'type': 'on-demand',
    },
    {
      'currency': 'usd',
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/183946473',
      'prices': {
        'purchase': 19.99,
        'rent': 19.99,
      },
      'source': 'fandango_at_home',
      'type': 'on-demand',
    },
    {
      'currency': 'usd',
      'is4k': false,
      'link': 'https://trakt.tv/watchnow/189673385',
      'prices': {
        'purchase': 24.99,
        'rent': 19.99,
      },
      'source': 'google_play_movies',
      'type': 'on-demand',
    },
    {
      'currency': 'usd',
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/189110875',
      'prices': {
        'purchase': 19.99,
        'rent': 19.99,
      },
      'source': 'microsoft_store',
      'type': 'on-demand',
    },
    {
      'currency': 'usd',
      'is4k': false,
      'link': 'https://trakt.tv/watchnow/189673386',
      'prices': {
        'purchase': 24.99,
        'rent': 19.99,
      },
      'source': 'youtube',
      'type': 'on-demand',
    },
  ],
  'streaming': [],
};
