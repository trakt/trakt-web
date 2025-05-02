import type { VideoResponse } from '@trakt/api';

type FixedVideoResponse = Omit<VideoResponse, 'type'> & {
  type:
    | VideoResponse['type']
    | 'opening credits';
};

export const ShowSiloVideoSeason1ResponseMock: FixedVideoResponse[] = [
  {
    'title': 'An Inside Look: Building a World',
    'url': 'https://youtube.com/watch?v=QQ6x6NjVM_E',
    'site': 'youtube',
    'type': 'behind the scenes',
    'size': 1080,
    'official': true,
    'published_at': '2023-06-30T16:59:46.000Z',
    'country': 'us',
    'language': 'en',
  },
];
