import type { WatchNowServices } from '$lib/requests/models/WatchNowServices.ts';

export const EpisodeSiloWatchNowMappedMock: WatchNowServices = {
  'onDemand': [],
  'streaming': [
    {
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/194270962',
      'source': 'apple_tv_plus',
      'type': 'streaming',
    },
    {
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/181597412',
      'source': 'apple_tv_plus_amazon_channel',
      'type': 'streaming',
    },
  ],
};
