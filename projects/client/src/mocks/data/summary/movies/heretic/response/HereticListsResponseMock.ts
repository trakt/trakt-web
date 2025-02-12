import type { ListResponse } from '$lib/api.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';

export const HereticListsResponseMock: ListResponse[] = [
  {
    'name': 'Heretics only',
    'description': 'This list contains Heretic',
    'privacy': 'public',
    'share_link': 'https://trakt.tv/lists/1234',
    'type': 'personal',
    'display_numbers': false,
    'allow_comments': true,
    'sort_by': 'added',
    'sort_how': 'asc',
    'created_at': '2018-07-29T10:16:22.000Z',
    'updated_at': '2025-02-09T21:39:59.000Z',
    'item_count': 1,
    'comment_count': 5,
    'likes': 4161,
    'ids': {
      'trakt': 1234,
      'slug': 'heretics-only',
    },
    'user': UserProfileHarryResponseMock,
  },
];
