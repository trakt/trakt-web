import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import type { ListResponse } from '@trakt/api';

export const SiloListsResponseMock: ListResponse[] = [
  {
    'name': 'Silos',
    'description': 'There is no escape from this list',
    'privacy': 'public',
    'share_link': 'https://trakt.tv/lists/5678',
    'type': 'personal',
    'display_numbers': false,
    'allow_comments': true,
    'sort_by': 'added',
    'sort_how': 'asc',
    'created_at': '2018-07-29T10:16:22.000Z',
    'updated_at': '2025-02-09T21:39:59.000Z',
    'item_count': 1,
    'comment_count': 2,
    'likes': 892,
    'ids': {
      'trakt': 5678,
      'slug': 'silos',
    },
    'user': UserProfileHarryResponseMock,
    'images': {
      'posters': [
        'walter-r2.trakt.tv/images/shows/000/173/996/posters/original/f498a2fa2b.jpg',
        'walter-r2.trakt.tv/images/shows/000/156/110/posters/original/1d002ba117.jpg',
        'walter-r2.trakt.tv/images/shows/000/126/995/posters/original/55b80503e9.jpg',
        'walter-r2.trakt.tv/images/shows/000/170/649/posters/original/39eb828a7a.jpg',
        'walter-r2.trakt.tv/images/shows/000/043/764/posters/original/9ef9162506.jpg',
        'walter-r2.trakt.tv/images/shows/000/058/454/posters/original/e7ca7525cb.jpg',
        'walter-r2.trakt.tv/images/shows/000/134/421/posters/original/6295516e91.jpg',
        'walter-r2.trakt.tv/images/shows/000/001/390/posters/original/93df9cd612.jpg',
        'walter-r2.trakt.tv/images/shows/000/104/578/posters/original/f43fc7f7db.jpg',
        'walter-r2.trakt.tv/images/shows/000/191/758/posters/original/3917ba20d9.jpg',
      ],
    },
  },
];
