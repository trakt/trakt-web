import type { VideoResponse } from '@trakt/api';

type FixedVideoResponse = Omit<VideoResponse, 'type'> & {
  type:
    | VideoResponse['type']
    | 'opening credits';
};

export const ShowSiloVideoResponseMock: FixedVideoResponse[] = [
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
  {
    'title': 'Uncovering the Truth',
    'url': 'https://youtube.com/watch?v=DsQzTUeLkbA',
    'site': 'youtube',
    'type': 'featurette',
    'size': 1080,
    'official': true,
    'published_at': '2023-04-26T14:59:56.000Z',
    'country': 'us',
    'language': 'en',
  },
  {
    'title': 'Opening Title Sequence',
    'url': 'https://youtube.com/watch?v=AJlOS6ZeIcA',
    'site': 'youtube',
    'type': 'opening credits',
    'size': 1080,
    'official': true,
    'published_at': '2023-04-25T21:00:04.000Z',
    'country': 'us',
    'language': 'en',
  },
  {
    'title': 'Official Trailer',
    'url': 'https://youtube.com/watch?v=8ZYhuvIv1pA',
    'site': 'youtube',
    'type': 'trailer',
    'size': 1080,
    'official': true,
    'published_at': '2023-04-06T12:59:48.000Z',
    'country': 'us',
    'language': 'en',
  },
  {
    'title': 'Official Teaser',
    'url': 'https://youtube.com/watch?v=bBMajXwi6Cs',
    'site': 'youtube',
    'type': 'teaser',
    'size': 1080,
    'official': true,
    'published_at': '2023-03-06T14:00:51.000Z',
    'country': 'us',
    'language': 'en',
  },
];
