import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import type { CommentResponse } from '@trakt/api';

export const MovieHereticCommentsResponseMock: CommentResponse[] = [
  {
    'id': 1337,
    'comment':
      'This all could have been avoided if he just started a podcast like a normal dude',
    'spoiler': false,
    'review': false,
    'parent_id': 0,
    'created_at': '2024-11-08T06:21:26.000Z',
    'updated_at': '2024-11-08T06:21:26.000Z',
    'replies': 1,
    'likes': 102,
    'user_rating': 8,
    'user_stats': {
      'rating': 8,
      'play_count': 1,
      'completed_count': 1,
    },
    'user': UserProfileHarryResponseMock,
  },
];
