import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const MovieHereticCommentsMappedMock: MediaComment[] = [
  {
    'comment':
      'This all could have been avoided if he just started a podcast like a normal dude',
    'createdAt': new Date('2024-11-08T06:21:26.000Z'),
    'id': 1337,
    'key': 'comment-1337',
    'isReview': false,
    'isSpoiler': false,
    'likeCount': 102,
    'parentId': 0,
    'replyCount': 1,
    'updatedAt': new Date('2024-11-08T06:21:26.000Z'),
    'user': {
      ...UserProfileHarryMappedMock,
      'stats': {
        'completedCount': 1,
        'playCount': 1,
        'rating': 8,
      },
    },
  },
];
