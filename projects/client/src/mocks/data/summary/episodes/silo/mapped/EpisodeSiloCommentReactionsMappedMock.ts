import type { UserReaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { UserProfileHarryMappedMock } from '../../../../users/mapped/UserProfileHarryMappedMock.ts';

export const EpisodeSiloCommentReactionsMappedMock: UserReaction[] = [
  {
    reactedAt: new Date('2023-03-11T06:25:15.000Z'),
    reaction: 'like',
    user: UserProfileHarryMappedMock,
  },
];
