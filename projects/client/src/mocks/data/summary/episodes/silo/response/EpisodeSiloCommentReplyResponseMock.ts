import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloCommentsResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentsResponseMock.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import type { CommentResponse } from '@trakt/api';

export const EpisodeSiloCommentReplyResponseMock: CommentResponse[] = [
  {
    'id': 421,
    'comment': 'This is a reply to another comment.',
    'spoiler': false,
    'review': false,
    'parent_id': assertDefined(EpisodeSiloCommentsResponseMock.at(0)).id,
    'created_at': '2023-03-11T06:25:15.000Z',
    'updated_at': '2023-03-11T06:25:15.000Z',
    'replies': 0,
    'likes': 1,
    'user_rating': null,
    'user_stats': {
      'rating': null,
      'play_count': 11,
      'completed_count': 11,
    },
    'user': UserProfileHarryResponseMock,
  },
];
