import type { CommentResponse } from '$lib/api.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';

export const EpisodeSiloCommentsResponseMock: CommentResponse[] = [
  {
    'id': 420,
    'comment':
      "this looks really good, can't wait. The fact that its on AppleTV and not Netflix series gives a big hope",
    'spoiler': false,
    'review': false,
    'parent_id': 0,
    'created_at': '2023-03-09T06:25:15.000Z',
    'updated_at': '2023-03-09T06:25:15.000Z',
    'replies': 1,
    'likes': 39,
    'user_rating': null,
    'user_stats': {
      'rating': null,
      'play_count': 11,
      'completed_count': 11,
    },
    'user': UserProfileHarryResponseMock,
  },
];
