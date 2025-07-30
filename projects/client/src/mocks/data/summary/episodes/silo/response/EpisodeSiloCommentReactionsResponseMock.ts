import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import { type ReactionsResponse } from '@trakt/api';

export const EpisodeSiloCommentReactionsResponseMock: ReactionsResponse[] = [
  {
    'reacted_at': '2023-03-11T06:25:15.000Z',
    'reaction': {
      'type': 'like',
    },
    'user': UserProfileHarryResponseMock,
  },
];
