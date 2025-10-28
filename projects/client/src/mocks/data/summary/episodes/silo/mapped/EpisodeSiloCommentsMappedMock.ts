import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const EpisodeSiloCommentsMappedMock: MediaComment[] = [
  {
    'comment':
      "this looks really good, can't wait. The fact that its on AppleTV and not Netflix series gives a big hope",
    'createdAt': new Date('2023-03-09T06:25:15.000Z'),
    'id': 420,
    'key': 'comment-420',
    'isReview': false,
    'isSpoiler': false,
    'likeCount': 39,
    'parentId': 0,
    'replyCount': 1,
    'updatedAt': new Date('2023-03-09T06:25:15.000Z'),
    'user': {
      ...UserProfileHarryMappedMock,
      'stats': {
        'completedCount': 11,
        'playCount': 11,
        'rating': null,
      },
    },
  },
];
