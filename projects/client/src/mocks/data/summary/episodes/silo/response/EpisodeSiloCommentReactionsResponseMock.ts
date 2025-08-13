import { type ReactionsSummaryResponse } from '@trakt/api';

export const EpisodeSiloCommentReactionsResponseMock: ReactionsSummaryResponse =
  {
    'reaction_count': 2,
    'user_count': 2,
    'distribution': {
      'like': 0,
      'dislike': 0,
      'love': 0,
      'laugh': 0,
      'shocked': 1,
      'bravo': 1,
      'spoiler': 0,
    },
  };
