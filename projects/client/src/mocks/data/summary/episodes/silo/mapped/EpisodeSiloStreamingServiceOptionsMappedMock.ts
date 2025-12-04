import type { StreamingServiceOptions } from '$lib/requests/models/StreamingServiceOptions.ts';

export const EpisodeSiloStreamingServiceOptionsMappedMock:
  StreamingServiceOptions = {
    'onDemand': [],
    'streaming': [
      {
        'is4k': true,
        'link': 'https://trakt.tv/watchnow/194270962',
        'source': 'apple_tv_plus',
        'type': 'streaming',
        'key': 'streaming-apple_tv_plus',
      },
      {
        'is4k': true,
        'link': 'https://trakt.tv/watchnow/181597412',
        'source': 'apple_tv_plus_amazon_channel',
        'type': 'streaming',
        'key': 'streaming-apple_tv_plus_amazon_channel',
      },
    ],
    'streamingRank': {
      'current': 67,
      'delta': -5,
    },
  };
