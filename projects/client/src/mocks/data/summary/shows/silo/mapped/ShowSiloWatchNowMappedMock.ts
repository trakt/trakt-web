import type { WatchNowServices } from '$lib/requests/models/WatchNowServices';

export const ShowSiloWatchNowMappedMock: WatchNowServices = {
  'onDemand': [],
  'streaming': [
    {
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/194269876',
      'source': 'apple_tv_plus',
      'type': 'streaming',
    },
    {
      'is4k': true,
      'link': 'https://trakt.tv/watchnow/181342180',
      'source': 'apple_tv_plus_amazon_channel',
      'type': 'streaming',
    },
  ],
};
