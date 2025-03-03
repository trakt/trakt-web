import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import type { ListResponse } from '@trakt/api';

export const CollaborationListsResponseMock: ListResponse[] = [
  {
    'name': 'Our collaborative list',
    'description': 'We made this',
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
      'slug': 'our-list',
    },
    'user': UserProfileHarryResponseMock,
  },
];
