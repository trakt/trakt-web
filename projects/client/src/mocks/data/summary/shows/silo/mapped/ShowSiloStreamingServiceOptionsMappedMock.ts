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
    'streamingRank': {
      'current': 42,
      'delta': -3,
    },
  };
