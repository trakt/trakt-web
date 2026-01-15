import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const EpisodeSiloCommentReplyMappedMock: MediaComment[] = [
  {
    'comment': 'This is a reply to another comment.',
    'createdAt': new Date('2023-03-11T06:25:15.000Z'),
    'id': 421,
    'key': 'comment-421',
    'isReview': false,
    'isSpoiler': false,
    'likeCount': 1,
    'parentId': 420,
    'replyCount': 0,
    'updatedAt': new Date('2023-03-11T06:25:15.000Z'),
    'user': {
      ...UserProfileHarryMappedMock,
      'stats': {
        'completedCount': 11,
        'playCount': 11,
        'rating': undefined,
      },
    },
  },
];
