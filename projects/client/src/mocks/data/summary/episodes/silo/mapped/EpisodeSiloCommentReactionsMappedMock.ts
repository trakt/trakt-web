import type { ReactionsSummary } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

export const EpisodeSiloCommentReactionsMappedMock: ReactionsSummary = {
  'count': 2,
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
