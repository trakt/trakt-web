import type { StreamingServiceOptions } from '$lib/requests/models/StreamingServiceOptions.ts';

export const ShowSiloStreamingServiceOptionsMappedMock:
  StreamingServiceOptions = {
    'onDemand': [],
    'streaming': [
      {
        'is4k': true,
        'link': 'https://trakt.tv/watchnow/194269876',
        'source': 'apple_tv_plus',
        'type': 'streaming',
        'key': 'streaming-apple_tv_plus',
      },
      {
        'is4k': true,
        'link': 'https://trakt.tv/watchnow/181342180',
        'source': 'apple_tv_plus_amazon_channel',
        'type': 'streaming',
        'key': 'streaming-apple_tv_plus_amazon_channel',
      },
    ],
    'free': [
      {
        'is4k': true,
        'link': 'https://trakt.tv/watchnow/185292672',
        'source': 'apple_tv_plus',
        'type': 'free',
        'key': 'free-apple_tv_plus',
      },
      {
        'is4k': true,
        'link': 'https://trakt.tv/watchnow/186099407',
        'source': 'amazon_prime_video',
        'type': 'free',
        'key': 'free-amazon_prime_video',
      },
    ],
    'streamingRank': {
      'current': 42,
      'delta': -3,
    },
  };
