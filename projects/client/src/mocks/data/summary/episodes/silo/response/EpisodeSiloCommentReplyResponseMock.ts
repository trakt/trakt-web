import type { CommentResponseWithGif } from '$lib/requests/_internal/CommentResponseWithGif.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloCommentsResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentsResponseMock.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';

export const EpisodeSiloCommentReplyResponseMock: CommentResponseWithGif[] = [
  {
    'id': 421,
    'comment': 'This is a reply to another comment.',
    'gif':
      'https://static.klipy.com/ii/8ce8357c78ea940b9c2015daf05ce1a5/ea/72/WGDcNWlt.gif',
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
