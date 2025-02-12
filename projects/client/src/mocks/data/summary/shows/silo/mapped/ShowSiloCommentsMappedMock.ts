import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { DEFAULT_AVATAR } from '$lib/utils/constants.ts';

export const ShowSiloCommentsMappedMock: MediaComment[] = [
  {
    'comment':
      "this looks really good, can't wait. The fact that its on AppleTV and not Netflix series gives a big hope",
    'createdAt': new Date('2023-03-09T06:25:15.000Z'),
    'id': 420,
    'isReview': false,
    'isSpoiler': false,
    'likeCount': 39,
    'parentId': 0,
    'replyCount': 1,
    'updatedAt': new Date('2023-03-09T06:25:15.000Z'),
    'user': {
      'avatar': {
        'url': DEFAULT_AVATAR,
      },
      'isVip': true,
      'slug': 'silo_enjoyer',
      'stats': {
        'completedCount': 11,
        'playCount': 11,
        'rating': null,
      },
      'userName': 'silo_enjoyer',
    },
  },
];
